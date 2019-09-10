import React from 'react';
import { saveSettings, download, downloadAll } from '../../../utils/helpers';
import './filesave.css';


class FileManager extends React.Component {
  componentWillReceiveProps(nextProps) {
    document.querySelector('#fileName').value = nextProps.state.fileName;
    if (this.props.state.canvasSize !== nextProps.state.canvasSize) {
      document.getElementById('sizeSelect').value = nextProps.state.canvasSize.toString();
    }
  }

  render() {
    return (
      <div className="file-manager">
        <div className="size-select">
          <p>Canvas size:</p>
          <select id = 'sizeSelect' onChange = {this.props.sizeSelect}>
            <option value="32">32 x 32</option>
            <option value="64">64 x 64</option>
            <option value="128">128 x 128</option>
          </select>
        </div>
        <div className='file-save'>
          <p>Save:</p>
          <input type='text' id='fileName' onChange={this.props.fNameChange} value={this.props.state.fileName} />
          <button onClick={() => { download(`${this.props.state.fileName}.piskel`, this.props.state); }}>Save piskel</button>
          <button onClick={() => { saveSettings(this.props.state); }}>Save in browser</button>
          <button onClick={() => { downloadAll(this.props.state.fileName, this.props.state.canvasFrames); }}>Save PNGs</button>
          <p>Import:</p>
          <input id='importFile' type='file' name='importFile' onChange={this.props.importFile} />
          <label for="importFile">Import file</label>
        </div>
      </div>
    );
  }
}

export default FileManager;
