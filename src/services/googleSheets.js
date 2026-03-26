export const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbx2sEmez5fQP_3uM7o1XBWFj_NBxUxKed7b_xZd3lBjIIU8n8gyiaJO53JvH0kG6cVF/exec";

/**
 * Send a submission to Google Sheets via Apps Script
 * @param {object} submission - data to submit
 */
export async function sendToGoogleSheet(submission) {
  const response = await fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify(submission)
  });

  if (!response.ok) {
    throw new Error(
      `Google Sheets submission failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
