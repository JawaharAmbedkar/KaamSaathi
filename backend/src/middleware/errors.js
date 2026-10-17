export function notFound(req, res) {
  res.status(404).json({ error: 'This page could not be found.' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error?.name === 'ZodError') {
    return res.status(400).json({ error: 'Please check the information and try again.', details: error.issues })
  }
  if (error?.statusCode === 502) {
    return res.status(502).json({ error: error.message })
  }
  console.error(error)
  return res.status(500).json({ error: 'Something went wrong. Please try again.' })
}
