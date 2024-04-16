import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: ' SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class ProjectsShowCase extends Component {
  state = {
    data: [],
    activeId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({data: updatedData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSelector = event => {
    this.setState({activeId: event.target.value}, this.getData)
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="ul-card">
        {data.map(each => (
          <li key={each.id} className="li-card">
            <img className="image" src={each.imageUrl} alt={each.name} />
            <p className="heading">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderInProgressView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="image"
      />
      <h1 className="">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.onRetry} type="button">
        Retry
      </button>
    </div>
  )

  onRetry = () => {
    this.getData()
  }

  renderPageView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state

    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="nav-image"
          />
        </nav>
        <div className="list-container">
          <select
            className="select-class"
            onChange={this.changeSelector}
            value={activeId}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderPageView()}
        </div>
      </div>
    )
  }
}

export default ProjectsShowCase
