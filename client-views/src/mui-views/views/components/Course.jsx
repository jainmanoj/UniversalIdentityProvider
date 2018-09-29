import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const Course = props => {
  // console.log(`Manoj Course--> ${JSON.stringify(props.course, null, 4)}`);
  return (
    <div>
      {props.course ? (
        <Card>
          <CardMedia
            style={{ height: 0, paddingTop: '56.25%' }}
            title={props.course.fields.title}
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {props.course.fields.title}
            </Typography>
            <Typography component="p">
              {props.course.fields.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              href={props.course.fields.url}
              target="_blank"
            >
              Go To Course
            </Button>
          </CardActions>
        </Card>
      ) : null}
    </div>
  );
};

Course.propTypes = {
  course: PropTypes.object.isRequired
};
export default Course;
