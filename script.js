document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    sidebarItems.forEach(item => {
        const link = item.querySelector('a').getAttribute('href');
        if (link === '#' || link === currentPage || (currentPage === '' && link === 'device.html')) {
            item.classList.add('active');
        }
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle conversion form submission
    const conversionForm = document.getElementById('conversionForm');
    if (conversionForm) {
        conversionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addConversionRecord();
        });
    }

    // Handle zoom button for dispatch list
    const zoomDispatchBtn = document.getElementById('zoomDispatchBtn');
    const dispatchListElement = document.querySelector('.dispatch-list'); // Renamed to avoid conflict

    if (zoomDispatchBtn && dispatchListElement) {
        zoomDispatchBtn.addEventListener('click', function() {
            dispatchListElement.classList.toggle('zoomed');
            if (dispatchListElement.classList.contains('zoomed')) {
                zoomDispatchBtn.textContent = '缩小';
            } else {
                zoomDispatchBtn.textContent = '放大';
            }
        });
    }

    // Modal functionality
    const modal = document.getElementById('editModal');
    const span = document.getElementsByClassName('close')[0];
    const editForm = document.getElementById('editForm');
    const editIndexInput = document.getElementById('editIndex');
    const editExpressInput = document.getElementById('editExpress');
    const editDispatcherInput = document.getElementById('editDispatcher');

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.onclick = function() {
            modal.style.display = 'none';
        }
    }

    // When the user clicks anywhere outside of the modal, close it
    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

    // Handle edit button click (defined in loadDispatches function in dispatch.html)
    // This function is expected to be called from dispatch.html
    window.editDispatch = function(index) {
        console.log('Edit button clicked for index:', index); // Add this line
        const dispatches = JSON.parse(localStorage.getItem('dispatches')) || [];
        const recordToEdit = dispatches[index];

        if (editIndexInput && editExpressInput && editDispatcherInput && modal) {
            editIndexInput.value = index;
            editExpressInput.value = recordToEdit.express || '';
            editDispatcherInput.value = recordToEdit.dispatcher || '';

            // Check if dispatch list is zoomed and unzoom it before showing modal
            const dispatchListElement = document.querySelector('.dispatch-list');
            if (dispatchListElement && dispatchListElement.classList.contains('zoomed')) {
                dispatchListElement.classList.remove('zoomed');
            }

            modal.style.display = 'block';
            console.log('Modal display set to block'); // Add this line
        }
    }

    // Handle edit form submission
    if (editForm) { // Add this check
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const index = parseInt(editIndexInput.value);
            let dispatches = JSON.parse(localStorage.getItem('dispatches')) || [];

            if (index >= 0 && index < dispatches.length) {
                dispatches[index].express = editExpressInput.value;
                dispatches[index].dispatcher = editDispatcherInput.value;
                localStorage.setItem('dispatches', JSON.stringify(dispatches));
                loadDispatches(); // Reload the table to show updated data
                modal.style.display = 'none'; // Close the modal

                // Update the zoom button text based on the current state
                const dispatchListElement = document.querySelector('.dispatch-list');
                const zoomDispatchBtn = document.getElementById('zoomDispatchBtn');
                if (dispatchListElement && zoomDispatchBtn) {
                    if (dispatchListElement.classList.contains('zoomed')) {
                        zoomDispatchBtn.textContent = '缩小';
                    } else {
                        zoomDispatchBtn.textContent = '放大';
                    }
                }
            }
        });
    }

});

// Function to add a new conversion record
function addConversionRecord() {
    const deviceName = document.getElementById('deviceName').value;
    const softwareName = document.getElementById('softwareName').value;
    const gameName = document.getElementById('gameName').value;

    if (!deviceName || !softwareName || !gameName) {
        alert('请填写所有字段');
        return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const newRecord = {
        date: formattedDate,
        deviceName: deviceName,
        softwareName: softwareName,
        gameName: gameName,
        isConverted: false // Default to not converted
    };

    const records = JSON.parse(localStorage.getItem('conversionRecords')) || [];
    records.push(newRecord);
    localStorage.setItem('conversionRecords', JSON.stringify(records));

    // Clear form
    document.getElementById('conversionForm').reset();

    // Reload records table
    loadConversionRecords();
}

// Function to toggle conversion status
function toggleConversionStatus(index) {
    const records = JSON.parse(localStorage.getItem('conversionRecords')) || [];
    if (index >= 0 && index < records.length) {
        const record = records[index];
        if (!record.isConverted) {
            if (confirm('确定要将此记录标记为已转化吗？')) {
                record.isConverted = true;
                localStorage.setItem('conversionRecords', JSON.stringify(records));
                loadConversionRecords(); // Reload table to reflect changes
            }
        }
    }
}

// Function to delete a conversion record
function deleteConversionRecord(index) {
    const records = JSON.parse(localStorage.getItem('conversionRecords')) || [];
    if (index >= 0 && index < records.length) {
        if (confirm('确定要删除此记录吗？')) {
            records.splice(index, 1);
            localStorage.setItem('conversionRecords', JSON.stringify(records));
            loadConversionRecords(); // Reload table to reflect changes
        }
    }
}

// Function to toggle rebate received status for dispatch records
function toggleRebateStatus(index) {
    let dispatches = JSON.parse(localStorage.getItem('dispatches')) || [];
    if (index >= 0 && index < dispatches.length) {
        dispatches[index].rebateReceived = !dispatches[index].rebateReceived; // Toggle the status
        localStorage.setItem('dispatches', JSON.stringify(dispatches));
        loadDispatches(); // Reload the table to reflect changes
    }
}

// loadDispatches and deleteDispatch functions are now inlined in dispatch.html script tag
