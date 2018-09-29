import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// import * as contentful from 'contentful'
import Course from './Course';

const SPACE_ID = '[INSERT YOUR CONTENTFUL SPACE ID HERE]';
const ACCESS_TOKEN = '[INSERT YOUR CONTENTFUL ACCESS TOKEN HERE]';

// const client = contentful.createClient({
//     space: SPACE_ID,
//     accessToken: ACCESS_TOKEN
// })

class CourseList extends Component {
  state = {
    courses: [],
    searchString: ''
  };

  constructor() {
    super();
    this.state.courses.map(currentCourse =>
      console.log(`Manoj ${JSON.stringify(currentCourse, null, 4)}`)
    );
  }
  componentDidMount() {
    this.getCourses();
    this.state.courses.map(currentCourse =>
      console.log(`Manoj ${JSON.stringify(currentCourse, null, 4)}`)
    );
  }

  getCourses = () => {
    const testCourses = [
      {
        fields: {
          title: 'Physics',
          description: 'Teach Physics',
          url: '/testpage',
          courseImage: {
            fields: {
              file: {
                url: '/image'
              }
            }
          }
        }
      },
      {
        fields: {
          title: 'Maths',
          description: 'Teach Maths',
          url: '/testpage',
          courseImage: {
            fields: {
              file: {
                url: '/image'
              }
            }
          }
        }
      }
    ];
    this.setState({ courses: testCourses });
  };

  onSearchInputChange = event => {
    if (event.target.value) {
      this.setState({ searchString: event.target.value });
    } else {
      this.setState({ searchString: '' });
    }
    this.getCourses();
  };

  render() {
    return (
      <div>
        {this.state.courses ? (
          <div>
            <TextField
              style={{ padding: 24 }}
              id="searchInput"
              placeholder="Search for Courses"
              margin="normal"
              onChange={this.onSearchInputChange}
            />
            <Grid container spacing={24} style={{ padding: 24 }}>
              {this.state.courses.map(
                currentCourse => (
                  console.log(
                    `Manoj List --> ${JSON.stringify(currentCourse, null, 4)}`
                  ),
                  (
                    <Grid item xs={12} sm={6} lg={4} xl={3}>
                      <Course course={currentCourse} />
                    </Grid>
                  )
                )
              )}
            </Grid>
          </div>
        ) : (
          'No courses found'
        )}
      </div>
    );
  }
}
export default CourseList;
