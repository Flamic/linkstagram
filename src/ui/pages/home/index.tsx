import { Link } from 'react-router-dom'

const HomePage = () => (
  <>
    <div>Home Page</div>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
    </ul>
  </>
)

export default HomePage
