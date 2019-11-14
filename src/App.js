import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upLoadedFile: null,
      caseSensitive: false,
      mathWhole: false,
      finded: '',
      findedCount: 0,
      findedIndex: 0,
    }

    this.searchStr = '';
  }

  onDrop = (file) => {
    const _this = this;
    if (file) { 
      var reader = new FileReader();
      reader.readAsText(file[0], "UTF-8");
      reader.onload = function (evt) {
        _this.setState({
          upLoadedFile: evt.currentTarget.result,
        });
      }
      reader.onerror = function (evt) {
        console.log('error: ', evt);
      }
    }
  }

  textFinder = (searchStr = this.searchedtext) => {
    this.searchedtext = searchStr;
    let str = this.state.upLoadedFile;
    let caseSensitive = this.state.caseSensitive;
    let mathWhole = this.state.mathWhole;
    var searchStrLen = searchStr.length;
    
    if (searchStrLen === 0) {
      this.setState({
        finded: str,
        findedIndex: 0,
        findedCount: 0
      });
      return;
    }
    
    var startIndex = 0, index, indexes = [];
    var checkedString = str;
    if (!caseSensitive) {
      checkedString = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }

    while ((index = checkedString.indexOf(searchStr, startIndex)) > -1) {
      if (mathWhole) {
        let res = checkedString.slice(index, checkedString.length).split(' ')[0].split('\n')[0];
        if (res.length === searchStr.length) {
          indexes.push(index);
        }
      } else {
        indexes.push(index);
      }
      startIndex = index + searchStrLen;
    }

    this.setState({
      findedCount: indexes.length,
      finded: this.replacer(str, indexes, searchStr),
      findedIndex: indexes.length ? 1 : 0
    },() => this.replacetarget(0));
    return;
  }

  replacer = (text, indexes, searchStr) => {
    for (let i = indexes.length-1; i >= 0; i--) {
      text = text.substr(0, indexes[i]) + "<tt>" + searchStr + "</tt>" + text.substr(indexes[i] + searchStr.length);
    }
    return text;
  }

  replacetarget = () => {
    const finded = document.querySelectorAll('tt');

    finded && finded.forEach(element => {
      element.classList.remove('target-finded');
    });
    const targetElement = document.getElementById('file-viewer-block').children[this.state.findedIndex-1];
    targetElement && targetElement.classList.add('target-finded');
    this.findedTextPosition(targetElement);
  }
  

  chooseCaseSensitive = () => {
    this.setState((state) => {
      return { caseSensitive: !state.caseSensitive }
    },
    () => {
      this.textFinder();
    });
  }

  chooseMatchWholeWord = () => {
    this.setState((state) => {
      return { mathWhole: !state.mathWhole }
    },
    () => this.textFinder());
  }


  goToDown = () => {
    if (1 < this.state.findedIndex && this.state.findedCount) {
      this.setState({
        findedIndex: --this.state.findedIndex
      });
      this.replacetarget(this.state.findedIndex);
    }    
  }

  goToUp = () => {
    if (this.state.findedIndex < this.state.findedCount) {
      this.setState({
        findedIndex: ++this.state.findedIndex
      });
      this.replacetarget(this.state.findedIndex);
    }
  }

  findBlockTogge = () => {
    this.setState((state) => {
      return { 
        isClose: !state.isClose,
        finded: ''
      }
    });
  }

  findedTextPosition = (element) => {
    element && element.scrollIntoView();
  }

  uploader = () => {
    return (
      <div className='upload-block'>
        <Dropzone onDrop={this.onDrop}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <i className="fa fa-upload"></i>  
                <p>Drop file or choose</p>
                <input {...getInputProps()} />
              </div>
            </section>
          )}
        </Dropzone>
      </div>)
  }

  fileViewer = () => {
    return (
      <pre className='file-viewer-block' id='file-viewer-block' dangerouslySetInnerHTML={{ __html: this.state.finded || this.state.upLoadedFile }}></pre>
    );
  }

  findBlock = () => {
    return(
      <div className='find-block'>
        <input onChange={(e) => this.textFinder(e.target.value)}/>
        <div className='icon-block' >
          <i className={`fa fa-font ${this.state.caseSensitive ? 'case-ctive' : '' }`} onClick={this.chooseCaseSensitive}></i>
          <i className={`fa fa-underline ${this.state.mathWhole ? 'case-ctive' : '' }`} onClick={this.chooseMatchWholeWord} ></i>
        </div>
        <span className='numbers-block'>{this.state.findedIndex} of {this.state.findedCount}</span>
        <div className='arrow-block'>
          <i className="fa fa-arrow-down" aria-hidden="true" onClick={this.goToUp}></i>  
          <i className="fa fa-arrow-up" aria-hidden="true" onClick={this.goToDown}></i>  
        </div>
        <i className="fa fa-times" aria-hidden="true" onClick={this.findBlockTogge}></i>
      </div>
    );
  }

  render() {
    const { upLoadedFile } = this.state;
    return (
      <div className="container root-container">
        <div className="row">
          <div className="col-sm-4">
            <h3 className='black-header'>Upload file</h3>
            {this.uploader()}
          </div>
          <div className="col-sm-8">
            <div className='black-header'>
              <p>File: {upLoadedFile && upLoadedFile.name}</p>
              {this.state.isClose && this.findBlock()}
              <button onClick={this.findBlockTogge} className='btn btn-default find-open-button'>Find</button>
            </div>
            {this.fileViewer()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
