const DAY_MS = 24 * 60 * 60 * 1000;

function parseDateRange(query, defaultDays = 30) {
  const to = query.to ? new Date(query.to) : new Date();
  const from = query.from ? new Date(query.from) : new Date(to.getTime() - defaultDays * DAY_MS);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    const err = new Error("Invalid 'from' or 'to' date.");
    err.status = 400;
    throw err;
  }

  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}

module.exports = { parseDateRange };
