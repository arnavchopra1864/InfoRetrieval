// FileView.js
import React from 'react';
import folderIcon from './folder-icon.png';
import queryIcon from './query-icon.png';

function FileView() {
    return (
        <div className="file-container">
            <div className='file-container-title'>
                <h2>Folders & History</h2>
            </div>
            <div className='inner-file-container'>
                <div className='folders-container'>
                    <h3 className='section-title'>Folders</h3>
                    <div className='folders'>
                        <div className='folder-item'>
                            <img src={folderIcon} alt="Folder Icon" className='folder-image'/>
                            <p className='folder-name'>Folder 1</p>
                        </div>
                        <div className='folder-item'>
                            <img src={folderIcon} alt="Folder Icon" className='folder-image'/>
                            <p className='folder-name'>Folder 2</p>
                        </div>
                        {/* Add more folder items as needed */}
                    </div>
                </div>

                <div className='queries-container'>
                    <h3 className='section-title'>Unfiled Queries</h3>
                    <div className='queries'>
                        <div className='query-item'>
                            <img src={queryIcon} alt="Query Icon" className='query-icon'/>
                            <p className='query-name'>Query 1</p>
                        </div>
                        <div className='query-item'>
                            <img src={queryIcon} alt="Query Icon" className='query-icon'/>
                            <p className='query-name'>Query 2</p>
                        </div>
                        {/* Add more query items as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileView;
