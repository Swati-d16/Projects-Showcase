import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsShowCase from './ProjectsShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    selectedCategory: 'ALL',
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectedCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`
    const options = {
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedProjectsList = fetchedData.projects.map(project => ({
          id: project.id,
          imageUrl: project.image_url,
          name: project.name,
        }))
        this.setState({
          projectsList: updatedProjectsList,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleCategoryChange = event => {
    this.setState({selectedCategory: event.target.value}, this.fetchProjects)
  }

  renderProjectsList = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list">
        {projectsList.map(project => (
          <ProjectsShowCase key={project.id} details={project} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.fetchProjects}
      >
        Retry
      </button>
    </div>
  )

  renderApiStatusView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsList()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectedCategory} = this.state

    return (
      <div className="app-container">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <div className="main-content">
          <select
            className="categories-selector"
            value={selectedCategory}
            onChange={this.handleCategoryChange}
          >
            {categoriesList.map(category => (
              <option key={category.id} value={category.id}>
                {category.displayText}
              </option>
            ))}
          </select>
          {this.renderApiStatusView()}
        </div>
      </div>
    )
  }
}

export default App
