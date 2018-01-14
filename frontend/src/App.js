import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import { Button, Typography, CircularProgress } from 'material-ui'
import { connect } from 'react-redux'
import * as imagesActions from './redux/actions/imagesActions';
import * as searchActions from './redux/actions/searchActions';

import { compose } from './utils/compose'

class App extends Component {

  onSubmitClicked = (event) => {
    if(this.props.posting) return;
    this.props.postFeedback();
  }

  onSearchClick = (event) => {
    if (this.props.fetching) return;
    if (this.props.currentSearchText) {
      this.props.searchPressed();
      this.props.getImages(this.props.currentSearchText);
    }
  }

  onSearchTextChange = (value) => {
    this.props.searchTextChanged(value);
  }

  onSelectImage = (name) => {
    this.props.selectImage(name);
  }



  render() {
  
    // var imagedata = [];
    // for(var i = 0; i< 41; i++) { 
    //   var str = i >= 10 ? '0000' : '00000';
    //   imagedata.push(`${str}${i}.jpg`)
    // }

    const middleComponent = () => {
      if (this.props.fetching || this.props.posting){
        return(
          <div style={appStyles.progressContainer}>
            <CircularProgress thickness={3} size={150} style={appStyles.progress} />
          </div>
        );
      }
      else {
        if (this.props.images) {
          return (
            <div>
              <ImageGrid 
                imagesSrcs={this.props.images} 
                selectedImagesSrcs={this.props.selectedImages} 
                style={appStyles.imageGrid} 
                onClickElement={name => this.onSelectImage(name)} 
              />
              <Button 
                raised 
                style={appStyles.submitButton} 
                onClick={event => this.onSubmitClicked(event)}>
                  Submit
              </Button>
            </div>
          );
        } else {
          if(this.props.posted) {
            return (
              <div style={appStyles.progressContainer}>
                <Typography style={appStyles.successText}>
                  Feedback was successfully posted!
                </Typography>
              </div>
            );
          } else {
            return null;
          }
        }
      }
    }

    return (
      <div className="App" style={appStyles.app}>
        <SearchBar 
          value={this.props.currentSearchText}
          onClick={event => this.onSearchClick(event)} 
          onChange={value => this.onSearchTextChange(value)}
        />
        {middleComponent()}
      </div>
    );
  }
}
const appStyles = {
  app: {
    padding: 0,
    margin: 12
  },
  imageGrid: { 
    marginTop: 48 
  },
  submitButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 48, 
    marginBottom: 48, 
    display: 'block', 
    backgroundColor: 'rgb(66,133,244)',
    color: 'white'
  },
  successText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'rgb(66,133,244)'
  },
  progressContainer: {
    width: '100%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  progress: {
    color: 'rgb(66,133,244)',
  }
}

function mapStateToProps(state) {

  return {
    images: state.imagesReducer.images,
    selectedImages: state.imagesReducer.selectedImages,
    step: state.imagesReducer.step,
    fetching: state.imagesReducer.fetching,
    posted: state.imagesReducer.posted,
    posting: state.imagesReducer.posting,
    currentSearchText: state.searchReducer.currentSearchText
  }
}

function mapDispatchToProps(dispatch) {
  const {
    getImages,
    getImagesSuccess,
    getImagesFailure,
    selectImage,
    postFeedback
  } = imagesActions;
  const {
    searchTextChanged,
    searchPressed
  } = searchActions;
  return {
    getImages: compose(dispatch, getImages),
    getImagesSuccess: compose(dispatch, getImagesSuccess),
    getImagesFailure: compose(dispatch, getImagesFailure),
    selectImage: compose(dispatch, selectImage),
    postFeedback: compose(dispatch, postFeedback),
    searchTextChanged: compose(dispatch, searchTextChanged),
    searchPressed: compose(dispatch, searchPressed),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
