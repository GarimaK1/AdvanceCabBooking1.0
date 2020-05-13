module.exports = (req, res, next) => {
  try {
    if (req.userData.role !== 'admin') {
      console.log('User does not have access here.');
      res.status(401).json({ message: "Invalid authorization!" });// 401 for authentication failure
    } else {
      next();
    }
  } catch (err) {
    console.log('Error fetching user role: ' + err);
    res.status(401).json({ message: 'Error fetching user information' });// 401 for authentication failure
  }
}
