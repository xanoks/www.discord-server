"use strict";

// ========================================
// CONFIGURATION - Edit these values
// ========================================
// Discord invite code (null if not configured)
// Only include the part after discord.gg/
// Example: "xanoks" for discord.gg/xanoks
const DISCORD_CODE = null;

// Development mode (true = shows "coming soon" notice)
const IS_DEV = true;
// ========================================

(function () {
  // Freeze config to prevent external modifications
  const config = Object.freeze({
    discordCode: DISCORD_CODE,
    isDev: IS_DEV,
  });

  // Strict regex to validate Discord codes
  // Accepts only: letters, numbers, hyphens (2-32 characters)
  const DISCORD_CODE_REGEX = /^[a-zA-Z0-9-]{2,32}$/;

  // Official Discord domain (whitelist)
  const DISCORD_DOMAIN = "https://discord.gg/";

  /**
   * Validates and extracts Discord invite code
   * @param {string|null} input - Code or URL to validate
   * @returns {string|null} - Validated code or null if invalid
   */
  function validateDiscordCode(input) {
    if (!input || typeof input !== "string") {
      return null;
    }

    // Sanitize input
    const trimmed = input.trim();

    // If full URL, extract the code
    if (
      trimmed.includes("discord.gg/") ||
      trimmed.includes("discord.com/invite/")
    ) {
      const match = trimmed.match(
        /(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9-]+)/i,
      );
      if (match && match[1] && DISCORD_CODE_REGEX.test(match[1])) {
        return match[1];
      }
      return null;
    }

    // Validate raw code
    if (DISCORD_CODE_REGEX.test(trimmed)) {
      return trimmed;
    }

    return null;
  }

  /**
   * Displays the appropriate page state
   */
  function initializePage() {
    const joinBtn = document.getElementById("join-btn");
    const noticeDev = document.getElementById("notice-dev");
    const noticeError = document.getElementById("notice-error");

    // Ensure all required elements exist
    if (!joinBtn || !noticeDev || !noticeError) {
      console.error("Missing DOM elements");
      return;
    }

    // Priority: isDev > no link/invalid > configured link
    if (config.isDev === true) {
      noticeDev.classList.remove("hidden");
      return;
    }

    const validCode = validateDiscordCode(config.discordCode);

    if (!validCode) {
      noticeError.classList.remove("hidden");
      return;
    }

    // Build URL securely
    joinBtn.setAttribute(
      "href",
      DISCORD_DOMAIN + encodeURIComponent(validCode),
    );
    joinBtn.classList.remove("hidden");
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
  } else {
    initializePage();
  }
})();
