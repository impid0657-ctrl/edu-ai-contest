<?php
    $title='User Roles & Permissions';
    $subTitle='User Roles & Permissions';
    $script = '<script>
                  let table = new DataTable(\'#dataTable\');
              </script>';
?>

<?php include './layouts/layout-top.php' ?>

    <div class="card basic-data-table">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table bordered-table mb-0 mx-0" id="dataTable" data-page-length='10'>
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Status</th>
                <th scope="col">Role</th>
                <th scope="col">Permission Group</th>
                <th scope="col">Location</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list1.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Kathryn Murphy</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">kathrynmurphy@gmail.com</span>
                    </div>
                  </div>
                </td>
                <td> 
                  <span class="bg-success-focus text-success-main px-20 py-4 rounded fw-medium text-sm">Active</span>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option>Admin</option>
                    <option>Employee</option>
                    <option>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Full Access</option>
                    <option>Hosts</option>
                    <option>View Only</option>
                    <option>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td>
                  <span class="text-sm mb-0 fw-normal text-secondary-light d-block">Mikel Roads, Port Arnoldo, ID</span>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Deactivate</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list3.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Kathryn Murphy</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">kathryn.murphy@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-success-focus text-success-main px-20 py-4 rounded fw-medium text-sm">Active</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option>Admin</option>
                    <option selected>Employee</option>
                    <option>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option selected>Full Access</option>
                    <option>Hosts</option>
                    <option>View Only</option>
                    <option>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">New York, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Deactivate</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list2.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Devon Lane</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">devon.lane@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-danger-focus text-danger-main px-20 py-4 rounded fw-medium text-sm">Inactive</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option selected>Admin</option>
                    <option>Employee</option>
                    <option>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Full Access</option>
                    <option selected>Hosts</option>
                    <option>View Only</option>
                    <option>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">Los Angeles, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Activate</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Leslie Alexander</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">leslie.alexander@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-success-focus text-success-main px-20 py-4 rounded fw-medium text-sm">Active</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option>Admin</option>
                    <option selected>Employee</option>
                    <option>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Full Access</option>
                    <option>Hosts</option>
                    <option selected>View Only</option>
                    <option>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">New York, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Deactivate</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list4.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Cameron Williamson</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">cameron.williamson@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-warning-focus text-warning-main px-20 py-4 rounded fw-medium text-sm">Pending</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option>Admin</option>
                    <option>Employee</option>
                    <option selected>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Full Access</option>
                    <option>Hosts</option>
                    <option>View Only</option>
                    <option selected>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">Chicago, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Approve</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list6.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Eleanor Pena</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">eleanor.pena@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-success-focus text-success-main px-20 py-4 rounded fw-medium text-sm">Active</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option>Admin</option>
                    <option selected>Employee</option>
                    <option>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Full Access</option>
                    <option selected>Hosts</option>
                    <option>View Only</option>
                    <option>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">Miami, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Deactivate</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list7.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Robert Fox</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">robert.fox@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-danger-focus text-danger-main px-20 py-4 rounded fw-medium text-sm">Inactive</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option selected>Manager</option>
                    <option>Admin</option>
                    <option>Employee</option>
                    <option>Owner</option>
                    <option>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option selected>Full Access</option>
                    <option>Hosts</option>
                    <option>View Only</option>
                    <option>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">Dallas, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Activate</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="assets/images/user-list/user-list8.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                    <div class="flex-grow-1">
                      <span class="text-md mb-0 fw-bolder text-primary-light d-block">Kristin Watson</span>
                      <span class="text-sm mb-0 fw-normal text-secondary-light d-block">kristin.watson@example.com</span>
                    </div>
                  </div>
                </td>
                <td><span class="bg-warning-focus text-warning-main px-20 py-4 rounded fw-medium text-sm">Pending</span></td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Manager</option>
                    <option>Admin</option>
                    <option>Employee</option>
                    <option>Owner</option>
                    <option selected>Staff</option>
                    <option>Host</option>
                    <option>Analyst</option>
                  </select>
                </td>
                <td>
                  <select class="form-control w-auto border border-neutral-900 fw-semibold text-primary-light text-sm">
                    <option>Full Access</option>
                    <option>Hosts</option>
                    <option>View Only</option>
                    <option selected>Accounting</option>
                    <option>Management</option>
                  </select>
                </td>
                <td><span class="text-sm mb-0 fw-normal text-secondary-light d-block">Seattle, USA</span></td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn rounded border text-neutral-500 border-neutral-500 radius px-4 py-6 bg-hover-neutral-500 text-hover-white flex-grow-1">Approve</button>
                    <button type="button" class="btn rounded border text-info-500 border-info-500 radius px-4 py-6 bg-hover-info-500 text-hover-white flex-grow-1">Edit</button>
                    <button type="button" class="btn rounded border text-danger-500 border-danger-500 radius px-4 py-6 bg-hover-danger-500 text-hover-white flex-grow-1">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

<?php include './layouts/layout-bottom.php' ?>