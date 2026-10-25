
export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  let targetStatus = null;
  let statusText = "Connection Failed";
  let targetOk = false;

  try {
    const response = await fetch("http://148.222.71.21/", {
      signal: controller.signal,
      redirect: "manual"
    });

    targetStatus = response.status;
    statusText = response.statusText || "Unknown Status";
    targetOk = response.ok;
  } catch (error) {
    statusText = error.name === "AbortError"
      ? "Connection Timeout"
      : "Connection Failed";
  } finally {
    clearTimeout(timeout);
  }

  return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <title>OK</title>
</head>
<body>
  OK
</body>
</html>`);
}
