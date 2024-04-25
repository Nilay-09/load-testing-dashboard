(
    <div className="App">

        <div className="h-22 w-22 flex items-center px-[4.5rem] py-6 gap-5">
            <img src={OC} alt="" className=' object-contain w-20' />

            <div className="field" id="searchform">
                <input type="text" id="searchterm" placeholder="Powerbi URL" className='' />
                <button type="button" id="search" onClick={handleSearch}>Search
                </button>

            </div>




        </div>




        <div className="flex checkbox-container w-full h-[3.5rem] px-[5rem] mb-5">

            <input type="checkbox" id="startSelecting" checked={isChecked} onChange={handleCheckboxChange} />
            <label htmlFor="startSelecting" className='text-gray-700 font-bold'>Start Selecting Items to Test Load</label>


            <div className="file-input text-white ml-3">
                <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    className="file-input__input"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                />
                <label className="file-input__label" htmlFor="file-input">
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="upload"
                        className="svg-inline--fa fa-upload fa-w-16 text-white"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path
                            fill="currentColor"
                            d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                        ></path>
                    </svg>
                    <span className='text-white'>Upload file</span></label
                >
            </div>


            <div className='vn-green text-center'>
                <a href={temp} download="Template" className="btn-wrap">Download Template</a>
            </div>


            <div className="rounded-lg p-4">
                <div className="flex flex-col">
                    <div className="flex justify-between border-b border-gray-300 pb-2 mb-2">
                        <span className="font-bold">System Ram:</span>
                        <span>{ram?.ram}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-bold">Processor:&nbsp;</span>
                        <span>&nbsp;{ram?.processor}</span>
                    </div>
                </div>
            </div>

        </div>

        <hr className="border border-solid border-[#0000009e] border-b-1 mb-5" />


        {/* <iframe title="report" width="1140" height="541.25" src={webUrl} frameborder="0" allowFullScreen="true"></iframe> */}


        <div className="flex justify-start items-center w-full ">
            <div className="w-[100%]  flex justify-start mb-8 px-[4.5rem] gap-10">
                <PowerBIEmbed
                    embedConfig={{
                        type: 'report',
                        id: reportId,
                        embedUrl: webUrl,
                        accessToken: anAccessToken,
                        tokenType: models.TokenType.Aad,
                        settings: {
                            panes: {
                                filters: {
                                    expanded: false,
                                    visible: true
                                }
                            }
                        }
                    }}

                    eventHandlers={
                        new Map([
                            [ 'loaded', function () {

                                console.log('Report loaded', window.report);
                            } ],
                            [ 'rendered', function () { console.log('Report rendered'); } ],
                            [ 'error', function (event) { console.log(event.detail); } ],
                            [ 'visualClicked', handleVisualClicked ],
                            [ 'pageChanged', (event) => console.log(event) ],
                        ])
                    }

                    cssClassName={"reportClass"}

                    getEmbeddedComponent={(embeddedReport) => {
                        window.report = embeddedReport;
                    }}


                />

                {isChecked && (
                    <div className="listHolder w-[400px]">
                        {/* Content of the div */}
                        <h2 className="text-lg font-bold mb-4">Visuals Selected for Load Testing</h2>


                        <ul className=" p-4 rounded shadow">
                            {clickedVisuals.map((visual, index) => (
                                <li key={index} className="flex items-center justify-between mb-4 p-2 rounded bg-[#e7e7e737] w-full">
                                    <div className="">
                                        <div className="font-bold">{visual.VisualName}</div>
                                        <div className="text-gray-500">{visual.VisualID}</div>
                                        {visual.f && (
                                            <div className="">
                                                <input type="text" id={`input-${visual.VisualID}`} />
                                            </div>
                                        )}

                                    </div>

                                    <span className="delete-icon" onClick={() => handleDeleteEntry(index)}>❌</span>
                                </li>
                            ))}
                        </ul>

                        {clickedVisuals.length === 5 && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Total Users"
                                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                                    id='totalUser'
                                />
                                <button
                                    onClick={handleSubmit}
                                    className="mt-2 px-4 py-2 bg-[#00acc1] text-white rounded  focus:outline-none"
                                >
                                    Submit
                                </button>
                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
        <hr className="border border-solid border-[#0000009e] border-b-1" />



        <div className="mt-8 w-full px-[6.5rem] flex items-center mb-[200px]">
            <p className="text-xl font-bold mb-2">Results from Load Test</p>
            <a href="/" className="btn-wrap vn-green flex h-10">Export to PDF</a>

        </div>



    </div>
);