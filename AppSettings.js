settings = {
  // @if ENV == 'DEVELOPMENT'
  apiUrl: 'http://localhost:9000',
  debug: true
  // @endif

  // @if ENV == 'PRODUCTION'
  apiUrl: 'http://mealchooser-backend.herokuapp.com',
  debug: false
  // @endif
}