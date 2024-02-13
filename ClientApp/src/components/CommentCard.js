import React from 'react';
import { Card, Typography, CardContent,Chip } from '@mui/material';

export default class CommentCard extends React.Component {
  render() {
    const { comment } = this.props;

    return (
      <Card variant="outlined" sx={{ margin: '10px' }}>
        <CardContent>
          {(
            <Chip label={comment.who === 'A'?"Admin":"Worker"} color="primary" size="small" style={{ float: 'right' }}/>
          )}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Date: {comment.query_date.split('T')[0]} Time: {comment.query_time.split('.')[0]}
          </Typography>
          <Typography variant="body1">
            {comment.message}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}
