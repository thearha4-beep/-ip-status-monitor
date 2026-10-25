
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    5000
  );

  try {
    const response = await fetch(
      "http://148.222.71.21/",
      {
        signal: controller.signal,
        redirect: "manual"
      }
    );

    const statusDescriptions = {
      200: "OK",
      201: "Created",
      204: "No Content",
      301: "Moved Permanently",
      302: "Found",
      304: "Not Modified",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      408: "Request Timeout",
      418: "I'm a teapot",
      429: "Too Many Requests",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout"
    };

    return res.status(200).json({
      ok: true,
      monitorStatus: 200,
      target: "148.222.71.21",
      targetStatus: response.status,
      statusText:
        statusDescriptions[response.status] ||
        response.statusText ||
        "Unknown Status",
      targetOk: response.ok,
      redirected: response.redirected,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(200).json({
      ok: true,
      monitorStatus: 200,
      target: "148.222.71.21",
      targetStatus: null,
      statusText:
        error.name === "AbortError"
          ? "Connection Timeout"
          : "Connection Failed",
      targetOk: false,
      checkedAt: new Date().toISOString()
    });
  } finally {
    clearTimeout(timeout);
  }
      }
