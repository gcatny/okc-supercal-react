export const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbx18bq_F9v48ppoBHQeBev40qDiMYVhBWR7jUI8-VuCZHQzIZcoM_TpbLkjSYMl8Xof/exec";

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
