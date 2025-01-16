"use strict";

import { tweetsData } from "./index.js";

function getFeedHtml() {
  let feedHtml = "";
  tweetsData.forEach((element) => {
    let likeIconClass = element.isLiked ? "liked" : "";
    let retweetIconClass = element.isRetweeted ? "retweeted" : "";

    let repliesHtml = "";

    if (element.replies.length > 0) {
      element.replies.forEach((el) => {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${el.profilePic}" class="profile-pic">
            <div>
              <p class="handle">${el.handle}</p>
              <p class="tweet-text">${el.tweetText}</p>
            </div>
          </div>
        </div>`;
      });
    }

    feedHtml += `
      <div class="tweet">
        <div class="tweet-inner">
          <img src="${element.profilePic}" class="profile-pic">
          <div>
            <p class="handle">${element.handle}</p>
            <p class="tweet-text">${element.tweetText}</p>
            <div class="tweet-details">
              <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${element.uuid}"></i>
                ${element.replies.length}
              </span>
              <span class="tweet-detail">
                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${element.uuid}"></i>
                ${element.likes}
              </span>
              <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${element.uuid}"></i>
                ${element.retweets}
              </span>
            </div>
          </div>
        </div>
        <div class="hidden" id="replies-${element.uuid}">
          ${repliesHtml}
        </div>
      </div>`;
  });
  return feedHtml;
}

function renderFeed() {
  document.querySelector("#feed").innerHTML = getFeedHtml();
}
renderFeed();

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter((el) => el.uuid === tweetId)[0];
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  renderFeed();
}

function handleRetweetClick(tweetId) {
  const targetRetweetObj = tweetsData.find((el) => el.uuid === tweetId);

  if (targetRetweetObj.isRetweeted) {
    targetRetweetObj.retweets--;
  } else targetRetweetObj.retweets++;

  targetRetweetObj.isRetweeted = !targetRetweetObj.isRetweeted;
  renderFeed();
}

function handleReplyClick(replyId) {
  document.querySelector(`#replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const TWEET_INPUT = document.querySelector("#tweet-input");
  const newTweet = {
    handle: "@Scrimba",
    profilePic: `./images/scrimbalogo.png`,
    likes: 10,
    retweets: 20,
    tweetText: `${TWEET_INPUT.value}`,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    uuid: `${crypto.randomUUID()}`,
  };

  if (newTweet.tweetText) {
    tweetsData.unshift(newTweet);
    sessionStorage.setItem("allTweets", JSON.stringify(tweetsData));
    TWEET_INPUT.value = "";
  }
  renderFeed();
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

window.addEventListener("load", () => {
  const savedTweet = sessionStorage.getItem("allTweets");
  if (savedTweet) {
    const parsedTweets = JSON.parse(savedTweet);
    tweetsData.length = 0;
    tweetsData.push(...parsedTweets);
    renderFeed();
  }
});
