import React from 'react';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';

import { getTweets, postTweet } from '../services/tweets';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('twitter_clone_token');
    const payload = jwtDecode(token);

    this.state = {
      tweets: [],
      isLoading: false,
      error: null,
      message: '',
      session: payload,
    };
  }

  async componentDidMount() {
    await this.handlePopulateTweets();
  }

  async handlePopulateTweets() {
    try {
      this.setState({ isLoading: true });
      const tweets = await getTweets();
      this.setState({ tweets, isLoading: false })
    } catch (error) {
      this.setState({ error });
    }
  }

  async handlePostTweet() {
    const { message } = this.state;

    if (!message) {
      return;
    }

    try {
      const newTweet = await postTweet({ message });
      this.setState({ message: '' });
      await this.handlePopulateTweets();
    } catch (error) {
      this.setState({ error });
    }
  }

  handleInputChange(field, event) {
    this.setState({
      [field]: event.target.value
    });
  }

  render() {
    console.log(this.state);
    const { tweets, isLoading, error, session, message } = this.state;

    if (error) {
      return (
        <div>Error: {error.message}</div>
      );
    }

    if (isLoading) {
      return (
        <div>Loading tweets...</div>
      );
    }

    const tweetElements = tweets.map(({ id, name, handle, message }) => {
      return (
        <div key={id} style={{ border: '1px solid black', margin: 10, maxWidth: 500, margin: '10px auto', padding: 10, textAlign: 'left' }}>
          <p>{name} (@{handle})</p>
          <p>{message}</p>
        </div>
      )
    })

    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Feed ({session.name} @{session.handle}) <Link to="/logout">Logout</Link></h1>

        <div>
          <input
            style={{ margin: 10, fontSize: 23, width: 500 }}
            type="text"
            placeholder="What's on your mind?"
            value={message}
            onChange={this.handleInputChange.bind(this, 'message')}
          />
        </div>
        <div>
          <button style={{ fontSize: 20 }} onClick={this.handlePostTweet.bind(this)}>Tweet</button>
        </div>

        <div>
          {tweetElements}
        </div>
      </div>
    );
  }
}

export default Feed;
