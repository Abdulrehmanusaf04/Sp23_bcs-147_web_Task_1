

$(document).ready(function() {
    // Initialize Bootstrap toasts
    const successToast = new bootstrap.Toast(document.getElementById('successToast'));
    const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

    // Base URL for JSONPlaceholder API
    const API_URL = 'https://jsonplaceholder.typicode.com/users';

    // State variables
    let users = [];
    let isEditing = false;
    let currentEditId = null;

    // DOM elements
    const $userForm = $('#userForm');
    const $usersList = $('#usersList');
    const $loadingSpinner = $('#loadingSpinner');
    const $usersCount = $('#usersCount');
    const $searchInput = $('#searchInput');
    const $resetFormBtn = $('#resetFormBtn');
    const $formTitle = $('#formTitle');
    const $submitBtn = $('#submitBtn');

    // Show notification
    function showNotification(message, type = 'success') {
        if (type === 'success') {
            $('#successMessage').text(message);
            successToast.show();
        } else {
            $('#errorMessage').text(message);
            errorToast.show();
        }
    }

    // Show loading state
    function showLoading() {
        $loadingSpinner.show();
        $usersList.hide();
    }

    // Hide loading state
    function hideLoading() {
        $loadingSpinner.hide();
        $usersList.show();
    }

    // Fetch all users
    function fetchUsers() {
        showLoading();
        
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(data) {
                users = data;
                renderUsers(users);
                hideLoading();
                updateUsersCount();
            },
            error: function(xhr, status, error) {
                hideLoading();
                showNotification('Failed to load users: ' + error, 'error');
                console.error('Error fetching users:', error);
            }
        });
    }

    // Create a new user
    function createUser(userData) {
        showLoading();
        
        $.ajax({
            url: API_URL,
            method: 'POST',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(data) {
                // Since JSONPlaceholder doesn't actually create the user, we'll simulate it
                data.id = Date.now(); // Generate a unique ID
                users.unshift(data); // Add to beginning of array
                renderUsers(users);
                hideLoading();
                showNotification('User created successfully!');
                resetForm();
            },
            error: function(xhr, status, error) {
                hideLoading();
                showNotification('Failed to create user: ' + error, 'error');
                console.error('Error creating user:', error);
            }
        });
    }

    // Update an existing user
    function updateUser(userId, userData) {
        showLoading();
        
        $.ajax({
            url: `${API_URL}/${userId}`,
            method: 'PUT',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(data) {
                // Update the user in our local array
                const index = users.findIndex(user => user.id === userId);
                if (index !== -1) {
                    users[index] = { ...users[index], ...userData };
                }
                renderUsers(users);
                hideLoading();
                showNotification('User updated successfully!');
                resetForm();
            },
            error: function(xhr, status, error) {
                hideLoading();
                showNotification('Failed to update user: ' + error, 'error');
                console.error('Error updating user:', error);
            }
        });
    }

    // Delete a user
    function deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        showLoading();
        
        $.ajax({
            url: `${API_URL}/${userId}`,
            method: 'DELETE',
            success: function() {
                // Remove the user from our local array
                users = users.filter(user => user.id !== userId);
                renderUsers(users);
                hideLoading();
                showNotification('User deleted successfully!');
                updateUsersCount();
            },
            error: function(xhr, status, error) {
                hideLoading();
                showNotification('Failed to delete user: ' + error, 'error');
                console.error('Error deleting user:', error);
            }
        });
    }

    // Render users list
    function renderUsers(usersToRender) {
        if (usersToRender.length === 0) {
            $usersList.html(`
                <div class="text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No users found</p>
                </div>
            `);
            return;
        }

        let html = '';
        usersToRender.forEach(user => {
            html += `
                <div class="card post-item mb-3">
                    <div class="card-body">
                        <div class="d-flex align-items-start">
                            <div class="user-avatar">
                                ${user.name.charAt(0)}
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title">${user.name}</h5>
                                <p class="card-text mb-1">
                                    <i class="fas fa-envelope me-1 text-muted"></i>
                                    ${user.email}
                                </p>
                                <p class="card-text mb-1">
                                    <i class="fas fa-phone me-1 text-muted"></i>
                                    ${user.phone || 'N/A'}
                                </p>
                                <p class="card-text">
                                    <i class="fas fa-globe me-1 text-muted"></i>
                                    ${user.website || 'N/A'}
                                </p>
                            </div>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-outline-primary edit-user" data-id="${user.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-user" data-id="${user.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $usersList.html(html);
        updateUsersCount(usersToRender.length);
    }

    // Update users count
    function updateUsersCount(count = users.length) {
        $usersCount.text(`${count} user${count !== 1 ? 's' : ''}`);
    }

    // Reset form
    function resetForm() {
        $userForm[0].reset();
        $('#userId').val('');
        isEditing = false;
        currentEditId = null;
        $formTitle.text('Add New User');
        $submitBtn.html('<i class="fas fa-plus me-1"></i>Add User');
        $resetFormBtn.hide();
    }

    // Search users
    function searchUsers(query) {
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        renderUsers(filteredUsers);
    }

    // Event Handlers
    $userForm.on('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            name: $('#userName').val().trim(),
            email: $('#userEmail').val().trim(),
            phone: $('#userPhone').val().trim(),
            website: $('#userWebsite').val().trim()
        };
        
        // Basic validation
        if (!userData.name || !userData.email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (isEditing && currentEditId) {
            updateUser(currentEditId, userData);
        } else {
            createUser(userData);
        }
    });

    // Edit user
    $(document).on('click', '.edit-user', function() {
        const userId = parseInt($(this).data('id'));
        const user = users.find(u => u.id === userId);
        
        if (user) {
            $('#userId').val(user.id);
            $('#userName').val(user.name);
            $('#userEmail').val(user.email);
            $('#userPhone').val(user.phone || '');
            $('#userWebsite').val(user.website || '');
            
            isEditing = true;
            currentEditId = user.id;
            $formTitle.text('Edit User');
            $submitBtn.html('<i class="fas fa-save me-1"></i>Update User');
            $resetFormBtn.show();
            
            // Scroll to form
            $('html, body').animate({
                scrollTop: $userForm.offset().top - 20
            }, 500);
        }
    });

    // Delete user
    $(document).on('click', '.delete-user', function() {
        const userId = parseInt($(this).data('id'));
        deleteUser(userId);
    });

    // Reset form button
    $resetFormBtn.on('click', function() {
        resetForm();
    });


    // Initial load
    fetchUsers();
});