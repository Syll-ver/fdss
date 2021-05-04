<template>
<div>
    <Loading v-if="showLoading" />
    <div>
      <b-alert
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
        class="alerticon"
      >
        <font-awesome-icon
          :icon="alert.variant == 'success' ? 'check-circle' : 'exclamation'"
          class="mr-1 alerticon"
        />
        {{ alert.message }}
      </b-alert>
    </div>
    <div>
      <!-- Main table -->
      <b-row>
        <b-col cols="3" class="mt-3">
          <b-form-group>
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Search User"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col cols="2" class="mt-3">
          <b-dropdown
              right
              id="filter_roles"
              class="button-sq"
              size="sm"
              variant="dark"
            >
              <template v-slot:button-content>
                <font-awesome-icon icon="filter" class="mr-1" />   
              </template> 
                <b-form-checkbox-group
                  id="status_group"
                  name="flavour-2"
                  class="pl-2"
                  style="font-size:12px"
                  v-model="filterStatus"
                  v-b-tooltip.hover
                  title="Filter Status"
                >Status<br>

                <b-form-checkbox id="active_stat" :value="1">Active</b-form-checkbox><br>
                  <b-form-checkbox id="inactive_stat" :value="0" unchecked-value="true">Inactive</b-form-checkbox>
                </b-form-checkbox-group>

              <!-- <b-form-checkbox-group
                id="status_group1"
                name="flavour-2"
                class="pl-2"
                style="font-size:12px"
                v-model="filterCompany"
                v-b-tooltip.hover
                title="Filter Company "
              >
                Company<br>
          
                <b-form-checkbox
                  size="sm"
                  :id="'choice' + i"
                  v-for="(company, i) in filterListCompanies"
                  :key="i"
                  :value="company.U_COMPANYCODE"
                >{{company.COMPANYDBNAME  }}
                </b-form-checkbox> -->
                      <!-- <b-form-checkbox id="Biotech" value="BIOTECH_FARMS_INC_DEV_INTEG_TESTING"
                  >Biotech</b-form-checkbox
                >
                <b-form-checkbox id="revive" value="REVIVE_DEV_INTEG_TESTING"
                  >REvive</b-form-checkbox> -->
              <!-- </b-form-checkbox-group> -->

            </b-dropdown>
        </b-col>
        <!-- <b-col></b-col> -->
 
        <b-col cols="7"  class="mt-3" align="right">
          <b-button
            id="add_user"
            size="sm"
            variant="biotech"
            class="button-style"
            @click="addUser()"
            v-if="actions.addUser"
          >
            <font-awesome-icon icon="plus" class="mr-1" />Add User
          </b-button>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        id="user-table"
        class="table-style"
        show-empty
        scrollable
        sticky-header
        no-border-collapse
        :busy="isBusy"
        :items="filterItems"
        :fields="filterFields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filterIncludedFields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        @filtered="onFiltered"
        responsive
      >
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner small class="align-middle" variant="dark">
            </b-spinner>
            <span class="loading_spinner">Loading...</span>
          </div>
        </template>

        <template v-slot:cell(actions)="row">
          <b-button
            id="edit_user"
            variant="edit"
            size="sm"
            @click="edit(row.item)"
            class="table-button"
            v-b-tooltip.hover
            title="Update User"
            v-if="actions.editUser"
          >
            <font-awesome-icon icon="edit" />
          </b-button>

          <b-button
            id="update_user"
            size="sm"
            variant="info"
            @click="update(row.item)"
            class="table-button" 
            v-b-tooltip.hover
            title="Update"
            v-if="actions.updateUser && row.item.ApplicationUserID"
          >
            <font-awesome-icon icon="sync" />
          </b-button>
          <b-button
            id="reset_user_password"
            size="sm"
            @click="resetpassword(row.item)"
            class="table-button"
            variant="danger"
            v-b-tooltip.hover
            title="Reset Password"
            v-if="actions.resetPassword && !row.item.ApplicationUserID"
          >
            <font-awesome-icon icon="undo-alt" />
          </b-button>
        </template>

        <template v-slot:cell(U_ROLE_CODE)="row">
          <div style="font-size:11.5px">
            {{
              listRoles.find(
                listRoles => listRoles.role_id === row.item.role_id 
              )
                ? listRoles.find(
                    listRoles => listRoles.Code === row.item.U_ROLE_CODE
                  ).Name
                : ""
            }}
          </div>
        </template>

        <template v-slot:cell(location)="row">
          <div>
            {{ 
              listLocations.find(loc => loc.Code === row.item.U_LOCATION_ID) ? 
              listLocations.find(loc => loc.Code === row.item.U_LOCATION_ID).U_ADDRESS : ""
            }}
          </div>
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
          <div style="font-size:15px">
            <b-badge
              style="width:70px"
              pill
              :variant="row.item.U_IS_ACTIVE ? 'success' : 'danger'"
              >{{ row.item.U_IS_ACTIVE ? "Active" : "Inactive" }}</b-badge
            >
          </div>
        </template>
      </b-table>

      <hr />

      <b-row>
        <b-col cols="1" class="mb-2 mt-1">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_users-pagination"
              size="sm"
              :options="pageOptions"
            ></b-form-select>
          </b-form-group>
        </b-col> 
        <b-col
          label-cols-sm
          class="mb-0 mt-2 text-left"
          cols="3"
          align-h="center"
        >
          <div size="sm" style="color: gray; font-size: 11.5px;">
            {{ bottomLabel }}
          </div>
        </b-col>
        <b-col>
          <b-pagination
            id="user-pagination"
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="user-table"
            limit="3"
            class="mt-1"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Main table -->

      <!-- Add User -->

      <b-modal
        size="lg"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        id="add-user-modal"
      
      >
        <template v-slot:modal-title>
          <h6>Add User</h6>
        </template>

        <b-row>
          <b-col cols="6" class="mt-2">
            <b-card class="cardShadow" style="height:17.5rem">
              <b-row class="mb-3">
                <b-col cols="6">
                  <b-button
                    id="add_user"
                    size="sm"
                    variant="biotech"
                    class="button-style"
                    style="font-size:12px; box-shadow:0px 10px 20px -10px #000000 "
                    @click="findUsers()"
                  >
                    <font-awesome-icon icon="search" class="mr-1" />Find User
                  </b-button>
                </b-col>
              </b-row>

              <small class="ml-1">First Name</small>
              <b-form-input
                id="first_name_add_modal"
                type="text"
                v-model="selectedUserDetails.FirstName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Middle Name</small>
              <b-form-input
                id="mid_name_add_modal"
                type="text"
                v-model="selectedUserDetails.MiddleName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Last Name</small>
              <b-form-input
                id="last_name_add_modal"
                type="text"
                v-model="selectedUserDetails.LastName"
                disabled
                style="font-size:10px"
              ></b-form-input>
            </b-card>

            <b-card class="cardShadow mt-4">
              <small class="ml-1">Email</small>
              <b-form-input
                id="email_add_modal"
                type="email"
                v-model="selectedUserDetails.eMail"
                disabled
                style="font-size:10px"
              ></b-form-input>
            </b-card>
          </b-col>
         

          <b-col class="mt-4">
            <b-card class="cardShadow" style="position:relative; bottom:14px">
              <small class="ml-1">SAP User</small>

              <b-form-select
                id="act_grp_add_modal"
                type="number"
                v-model="userDetails.U_IS_SAP_USER"
                style="font-size:10px"
                disabled
              >
                <option :value="null">Yes/No</option>
                <option :value="1">Yes</option>
                <option :value="0">No</option>
              </b-form-select>
            </b-card>

            <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              
                <small class="ml-1">Username</small>

              <b-form-input
                id="act_grp_add_modal"
                type="text"
                v-model="selectedUserDetails.ExternalEmployeeNumber"
                style="font-size:10px"
                disabled
              ></b-form-input>
              
              <small class="ml-1">Role</small>
                <b-form-select
                  id="role_add_modal"
                  type="number"
                  v-model="userDetails.U_ROLE_CODE"
                  style="font-size:10px"
                >
                  <option :value="null">Select Role</option>

                  <option
                    :value="role.Code"
                    v-for="(role, i) in filterListRoles"
                    :key="i"
                    >{{ role.Name }}</option
                  >
                </b-form-select>

                <small class="ml-1">Printer Location</small>
                <b-form-select v-model="userDetails.U_LOCATION_ID"
                  size="sm"
                  style="font-size:10px"
                  >
                  <option :value="null">Select Location</option>

                  <option
                    :value="loc.Code"
                    v-for="(loc, i) in listLocations"
                    :key="i"
                    >{{ loc.U_ADDRESS }}</option>
                </b-form-select>
             
            </b-card>

            <!-- <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Role</small>
              <b-form-select
                id="role_add_modal"
                type="number"
                v-model="userDetails.U_ROLE_CODE"
                style="font-size:10px"
              >
                <option :value="null">Select Role</option>

                <option
                  :value="role.Code"
                  v-for="(role, i) in filterListRoles"
                  :key="i"
                  >{{ role.Name }}</option
                >
              </b-form-select>

            </b-card> -->

            <!-- <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Company</small>
              <b-form-select
                style="font-size:10px"
                v-model="userDetails.U_COMPANY_ACCESS"
              >
                <option :value="null" disabled>Select Company</option>
                





                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-card> -->
          </b-col>

          <!-- <b-col cols="6" class="mt-3">
           
          </b-col>-->
        </b-row>
        <!-- <b-row>
             <b-col cols="6" class="mt-4 mb-1">
            <b-card class="cardShadow">
              <small class="ml-1">Status</small>
              <b-form-select
                type="number"
                id="stat_edit_modal"
                v-model="userDetails.U_IS_ACTIVE"
                class="form-text"
              >
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </b-form-select>
            </b-card>
          </b-col>
        </b-row>
    -->
        

        <template v-slot:modal-footer="{}">
          <b-button
            id="add_add_modal"
            size="sm"
            variant="biotech"
            @click="addUserTable()"
            style="font-size:13px"
            class="button-style"
            :disabled="showLoading === true"
          >
            Add
          </b-button>

          <b-button
            id="cancel_add_modal"
            size="sm"
            @click="cancelUser()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Add User -->

      <!-- Find User -->

      <b-modal
        size="lg"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        id="find-user-modal"
     
      >
        <template v-slot:modal-title>
          <h6>Find Users</h6>
        </template>

        <b-card class="cardShadow">
          <b-row class="mb-2">
            <b-col cols="4">
              <b-form-select
                style="font-size:12px"
                v-model="selectedCompany"
                @change="fetchEmployees()"
              >
                <option :value="null">Select Company</option>
                <option
                  v-for="(company, i) in filterListCompanies"
                  :key="i"
                  :value="company.U_COMPANYCODE"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-col>
            <b-col>
              <b-form-input
                id="first_name_add_modal"
                type="text"
                placeholder="Search User"
                v-model="filterUser"
                style="font-size:12px"
              ></b-form-input>
            </b-col>
            <!-- <b-button variant="success" class="button mr-1" size="sm"
              >Search

              <font-awesome-icon icon="search" />
            </b-button>-->
          </b-row>

          <b-table
            class="mt-4"
            ref="selectableTable"
            id="user-accounts-table"
            v-model="selectableTable"
            selectable
            show-empty
            :busy="isBusy"
            :items="SearchedUsers"
            :filter="filterUser"
            :fields="userFields"
            :current-page="currentPageUser"
            :per-page="perPages"
            select-mode="single"
            @row-selected="onRowSelected"
            responsive="sm"
          >
          
            <!-- Example scoped slot for select state illustrative purposes -->
            <template v-slot:cell(selected)="{ rowSelected }">
              <template v-if="rowSelected">
                <span aria-hidden="true">&check;</span>
                <span class="sr-only">Selected</span>
              </template>
              <template v-else>
                <span aria-hidden="true">&nbsp;</span>
                <span class="sr-only">Not selected</span>
              </template>
            </template>

            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner small class="align-middle"  variant="dark">
                  <strong><span class="loading_spinner">Loading...</span></strong>
                </b-spinner>
              </div>
            </template>

          </b-table>

          <hr />

          <b-row align-h="start">
            <b-col cols="1" class="mb-2 mt-1">
              <b-form-group class="mb-0">
                <b-form-select
                  v-model="perPages"
                  id="perPageSelect_modules-pagination"
                  size="sm"
                  :options="pageOptions"
                ></b-form-select>
              </b-form-group>
            </b-col> 
          <b-col
            label-cols-sm
            class="mb-0 mt-2 text-left"
            cols="3"
            align-h="center"
          >
            <div size="sm" style="color: gray; font-size: 11.5px;">
                {{ bottomLabelUser }}
              </div>
            </b-col>

            <b-col>
              <b-pagination
                id="user-accounts-pagination"
                pills
                v-model="currentPageUser"
                :total-rows="rowsUsers"
                :per-page="perPages"
                align="right"
                size="sm"
                aria-controls="user-table"
                limit="3"
              ></b-pagination>
            </b-col>
          </b-row>
        </b-card>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            id="add_add_modal"
            size="sm"
            variant="biotech"
            @click="selectedUser.length > 0 ? selectUser() : ''"
            class="button-style"
            >Select</b-button
          >
          <b-button
            id="cancel_add_modal"
            size="sm"
            @click="cancel()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Find User -->

      <!-- Edit -->

      <b-modal
        size="lg"
        body-bg-variant="light"
        header-bg-variant="biotech"
        header-text-variant="light"
        id="edit-modal"
      >
        <template v-slot:modal-title>
          <h6>Update User</h6>
        </template>

        <b-row>
          <b-col cols="6">
            <b-card class="cardShadow" style="height:13.8rem">
              <small class="ml-1">First Name</small>
              <b-form-input
                id="fname_edit_modal"
                type="text"
                v-model="selectedUserDetails.FirstName"
                class="form-text"
                disabled
              ></b-form-input>

              <small class="ml-1">Middle Name</small>
              <b-form-input
                id="mname_edit_modal"
                type="text"
                v-model="selectedUserDetails.MiddleName"
                class="form-text"
                disabled
              ></b-form-input>

              <small class="ml-1">Last Name</small>
              <b-form-input
                type="text"
                id="lname_edit_modal"
                v-model="selectedUserDetails.LastName"
                class="form-text"
                disabled
              ></b-form-input>
            </b-card>

            <b-card class="cardShadow mt-4">
              <small class="ml-1">Email</small>
              <b-form-input
                id="email_edit_modal"
                type="email"
                v-model="selectedUserDetails.eMail"
                class="form-text"
                disabled
              ></b-form-input>
            </b-card>

            <!-- <h6 class="mb-4 mt-2">Employee ID</h6>
            <b-card class="cardShadow" style="position:relative; bottom:14px">
              <small class="ml-1">Employee ID</small>
              <b-form-input
                id="emp_id_edit_modal"
                type="number"
                v-model="userDetails.U_EMPLOYEE_CODE"
                style="font-size:10px"
              ></b-form-input>
            </b-card>-->
          </b-col>

          <b-col cols="6" class="mt-3">
            <b-card class="cardShadow" style="position:relative; bottom:14px">
              <small class="ml-1">SAP User</small>

              <b-form-select
                id="act_grp_add_modal"
                type="number"
                v-model="userDetails.U_IS_SAP_USER"
                class="form-text"
                disabled
              >
                <option :value="null">Yes/No</option>
                <option :value="1">Yes</option>
                <option :value="0">No</option>
              </b-form-select>
            </b-card>

            <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Username</small>

              <b-form-input
                id="act_grp_add_modal"
                type="text"
                v-model="userDetails.U_USERNAME"
                class="form-text"
                disabled
              ></b-form-input>
            </b-card>

            <b-card class="cardShadow mt-3">
              <small class="ml-1">Role</small>
              <b-form-select
                id="role_edit_modal"
                type="number"
                v-model="userDetails.U_ROLE_CODE"
                class="form-text"
              >
                <option :value="null" disabled>Select Role</option>
                <option
                  :value="role.Code"
                  v-for="(role, i) in filterListRoles"
                  :key="i"
                  >{{ role.Name }}</option
                >
              </b-form-select>

               <small class="ml-1">Printer Location</small>
                <b-form-select v-model="userDetails.U_LOCATION_ID"
                  size="sm"
                  style="font-size:10px"
                >
                <option
                  :value="loc.Code"
                  v-for="(loc, i) in listLocations"
                  :key="i"
                  >{{ loc.U_ADDRESS }}</option
                >
                
                </b-form-select>
            </b-card>
          </b-col>
        </b-row>

        <b-row>
          <!-- <b-col cols="6">
            <b-card class="cardShadow mt-4" style="position:relative; TOP:14px">
              <small class="ml-1">Company</small>
              <b-form-select
                style="font-size:10px"
                v-model="userDetails.U_COMPANY_ACCESS"
              >
                <option :value="null" disabled>Select Company</option>
                <option :value="null">None</option>

                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-card>
          </b-col> -->

          <b-col cols="6" class="mt-4 mb-1">
            <b-card class="cardShadow">
              <small class="ml-1">Status</small>
              <b-form-select
                type="number"
                id="stat_edit_modal"
                v-model="userDetails.U_IS_ACTIVE"
                class="form-text"
              >
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </b-form-select>
            </b-card>
          </b-col>

          <b-col cols="6" class="mt-4 mb-1">
            <!-- <b-card
              class="cardShadow"
            >
              <small class="ml-1">Company</small>
              <b-form-select
                class="form-text"
                v-model="userDetails.U_COMPANY_ACCESS"
              >
                <option :value="null" disabled>Select Company</option>
                <option :value="null">None</option>

                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-card> -->
          </b-col>
        </b-row>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            size="sm"
            id="edt_edit_modal"
            variant="biotech"
            @click="editTable()"
            class="button-style"
            >Update</b-button
          >
          <b-button
            size="sm"
            id="cncl_edit_modal"
            @click="cancel()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Edit -->

      <!-- Update -->

      <b-modal
        size="sm"
        header-bg-variant="biotech"
        header-text-variant="light"
        id="update-user-modal"
      >
        <template v-slot:modal-title>
          <h6>Update SAP User</h6>
        </template>

        <div class="text-left">
          <h6>Do you want to update user?</h6>
        </div>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            size="sm"
            class="button-style"
            variant="biotech"
            @click="confirmUpdate()"
            
            >Update</b-button
          >
          <b-button
            size="sm"
            @click="cancel()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>
      <!-- Update modal -->

      <!-- Reset -->

      <b-modal
        size="sm"
        header-bg-variant="biotech"
        header-text-variant="light"
        id="reset-modal"
      >
        <template v-slot:modal-title>
          <h6>Reset Password</h6>
        </template>

        <div class="text-left">
          <h6>Do you want to reset user password?</h6>
        </div>

       <template v-slot:modal-footer="{ cancel }">
          <b-button
            id="Resetbutton"
            size="sm"
            variant="biotech"
            @click="confirmReset()"
            class="button-style"
            >Reset</b-button
          >
          <b-button
            id="cancelbutton"
            size="sm"
            @click="cancel()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>
      <!-- Reset modal -->
    </div>
</div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import Loading from "~/components/Loading/Loading.vue";

export default {
  components: {
    Loading
  },
  data() {
    return {
      isBusy: true,
      selectedCompany: null,
     
      showLoading: false,
      findUser: null,
      filterStatus: [1],
      actions: {
        addUser: false,
        editUser: false,
        resetPassword: false,
        updateUser: false
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: ""
      },
      userDetails: {
        Code: null,
        U_EMPLOYEE_CODE: null,
        U_COMPANY_ACCESS: null,
        U_COMPANY_CODE: null,
        U_ROLE_CODE: null,
        U_IS_ACTIVE: null,
        U_IS_SAP_USER: 0,
        U_USERNAME: null
      },
      locations: [],
      fields: [
          {
          key: "COMPANY_NAME",
          label: "Company",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "FirstName",
          label: "First Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "MiddleName",
          label: "Middle Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "LastName",
          label: "Last Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_USERNAME",
          label: "User Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_ROLE_CODE",
          label: "Role",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "location",
          label: "Location",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "location",
          label: "Printer Location",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_IS_ACTIVE",
          label: "Status",
          sortable: true,
          sortDirection: "desc"
        },

        { key: "actions", label: "Actions" }
      ],

      userFields: [
        {
          key: "FirstName",
          label: "First Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "MiddleName",
          label: "Middle Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "LastName",
          label: "Last Name",
          sortable: true,
          sortDirection: "desc"
        }
      ],
      selectedUser: [],
      selectedUserDetails: {
        ExternalEmployeeNumber: null,
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        eMail: null
      },
      filterCompany: ["REVIVE","BIOTECH"],
      selectableTable: null,
      totalRows: null,
      rowsUsers: null,
      currentPage: 1,
      perPage: 5,
      currentPageUser: 1,
      perPages: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: "",
      filterUser: null,
      filterOn: [],
    };
  },
  computed: {
    // altCompanyName() {
    //   console.log(this.listCompanies)
    //   if(this.filterCompany) {
    //     if( this.listCompanies.filter(
    //       company => company.U_COMPANYNAME.toLowerCase().search("revive") < 0
    //     )) {
          
    //     }
    //   }
    // },
      ...mapGetters({
      Users: "Admin/Users/getUsers",
      listRoles: "Admin/Roles/getListRoles",
      listCompanies: "Admin/Company/getListCompanies",
     listSAPcompanies: "SAP/Companies/getCompanyList",
     listLocations: "Admin/Location/getListLocations",
      companyList: "Company/getCompanyList",
      SearchedUsers: "Admin/Users/getSearchedUsers"
    }),
    filterListCompanies() {
      return this.listCompanies.filter(company => company.U_IS_ACTIVE == 1);
    },  
    filterSearchedUsers() {
      let count = 0;
      this.rowsUsers = count;
      return this.SearchedUsers.filter(users => {
        if(this.listCompanies.includes(this.selectedCompany)) {
          count++;
          this.rowsUsers = count;
          return (users.FirstName.toLowerCase().match(this.filterUser.toLowerCase()) || 
                  users.MiddleName.toLowerCase().match(this.filterUser.toLowerCase()) ||
                  users.LastName.toLowerCase().match(this.filterUser.toLowerCase()));
        }
      })
    },

    filterItems() {
      let count = 0;
      //this.filterCompany.includes(Users.COMPANY_NAME)
      // console.log(this.filterCompany);
      return this.Users.filter(Users => {
        if(this.filterStatus.includes(Users.U_IS_ACTIVE)){
          count++;
          this.totalRows = count;
          return (Users.COMPANY_NAME.toLowerCase().match(this.filter.toLowerCase()) || Users.FirstName.toLowerCase().match(this.filter.toLowerCase()) || Users.LastName.toLowerCase().match(this.filter.toLowerCase()) || Users.U_USERNAME.toLowerCase().match(this.filter.toLowerCase()));
        }
        if(this.filterStatus.includes(!Users.U_IS_ACTIVE)){
          count++;
          this.totalRows = count;
          return (Users.COMPANY_NAME.toLowerCase().match(this.filter.toLowerCase()) || Users.FirstName.toLowerCase().match(this.filter.toLowerCase()) || Users.LastName.toLowerCase().match(this.filter.toLowerCase()) || Users.U_USERNAME.toLowerCase().match(this.filter.toLowerCase()));
        }
      });
    },

    filterListRoles(){
      return this.listRoles.filter(Roles => {
        const results =
          Roles.U_IS_ACTIVE == 1
        return results;
      });
    },

    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if(!this.filterItems) {
        return;
      }

      if (end > this.filterItems.length) {
        end = this.filterItems.length;
      }

      if (this.filterItems.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.filterItems.length} entries`;
    },

    bottomLabelUser() {
      let end = this.perPages * this.currentPageUser;
      let start = end - this.perPages + 1;

      if (!this.filterSearchedUsers) {
        return;
      } 

      if (end > this.filterSearchedUsers.length) {
        end = this.filterSearchedUsers.length;
      }

      if (this.filterSearchedUsers.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.filterSearchedUsers.length} entries`;
    },

    // rowsUsers() {
    //   if (this.SearchedUsers) {
    //     return this.SearchedUsers.length;
    //   } else {
    //     return 0;
    //   }
    // },

    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    filterFields() {
      if (
        this.actions.resetPassword === false &&
        this.actions.editUser === false
      ) {
        return this.fields.filter(field => field.key !== "actions");
      } else {
        return this.fields;
      }
    }
  },

  methods: {
    async getLocations(userLocationId) {
      this.isBusy = true;

      this.listLocations.filter(loc => {
        if(loc.U_LOCATION_ID && (loc.U_LOCATION_ID == userLocationId)) {
          return loc.U_ADDRESS;
        } else {
          return "";
        }
      })

      //   await axios({
      //     method: "GET",
      //     url: `${this.$axios.defaults.baseURL}/api/location/select`
      //   }).then( res => {
      //     const v = res.data.view;
      //     this.locations.push({
      //         text: "Select Location",
      //         value: null,
      //         disabled: true
      //       })
          
      //     for(let i = 0; i < v.length; i++) {
      //       this.locations.push({
      //         text: v[i].U_ADDRESS,
      //         value: v[i].Code
      //       })
      //     }
      //   })
      // this.isBusy = false;
    },


    confirmUpdate() {
      this.showLoading = true;
      this.$store
        .dispatch("Admin/Users/updateSAPUser", {
          userDetails: this.userDetails,
          user_actions: JSON.parse(localStorage.user_actions),
          SessionId: localStorage.SessionId
        })

        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
          } else {
            this.showAlert("Successfully Updated", "success");
            this.$bvModal.hide("update-user-modal");
            this.clearForm();
          }
        });
      this.showLoading = false;
    },

    update(data) {
      this.userDetails = { ...data };
      this.$bvModal.show("update-user-modal");
    },
    async fetchEmployees() {
      console.log(this.selectedCompany)
      //  this.showLoading = true;
      this.isBusy = true;
      await this.$store
        .dispatch("Admin/Users/searchEmployees", {
          SessionId: localStorage.SessionId,
          CompanyDB: this.selectedCompany
        })

        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
          }

          if(!this.filterUser) {
            this.rowsUsers = this.SearchedUsers ? this.SearchedUsers.length : 0
          }
        //  this.showLoading = false;
          this.isBusy = false;
        });
    },
    cancelUser() {
      this.clearForm();
      this.$bvModal.hide("add-user-modal");
      this.selectedUserDetails = {
        ExternalEmployeeNumber: null,
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        eMail: null
      };
    },

    selectUser() {
      this.selectedUserDetails = { ...this.selectedUser[0] };
       this.userDetails.U_EMPLOYEE_CODE = this.selectedUserDetails.EmployeeID;
      this.userDetails.U_USERNAME = this.selectedUserDetails.ExternalEmployeeNumber;
      this.userDetails.U_IS_SAP_USER = 0;
      this.userDetails.U_COMPANY_CODE = this.selectedCompany;
      if (this.selectedUser[0].UserCode) {
        this.userDetails.U_USERNAME = this.selectedUser[0].UserCode;
        this.userDetails.U_IS_SAP_USER = 1;
      }
      this.$bvModal.hide("find-user-modal");
      this.findUser = null;
    },
    findUsers() {
      // this.showLoading =true;
      // this.selectedCompany = null;
      // this.$bvModal.show("find-user-modal");
      // this.showLoading = false;
      this.perPages = 5;
      this.currentPageUser = 1;
      this.selectedCompany = null;
      this.filterUser = "";
      if (this.selectedCompany == null) {
        this.SearchedUsers.length = [];
      }
      this.$bvModal.show("find-user-modal");
    
    },
    // cancel1(){
    //   this.clearForm();
    //   this.SearchedUsers=[];
    //   this.rowsUsers=[];
    //   // this.userFields={FirstName:null,
    //   // MiddleName:null,LastName:null};
    //   this.$bvModal.hide("add-user-modal");
    //   this.$bvModal.hide("find-user-modal");

    // },
    onRowSelected(items) {
      this.selectedUser = items;
    },
    confirmReset() {
      this.showLoading = true;
      this.$store
        .dispatch("Admin/Users/resetUserPassword", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          userForm: this.userDetails,
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
          } else {
            this.showAlert("Successfully Reseted", "success");
            this.$bvModal.hide("reset-modal");
            this.showLoading = false;
            this.clearForm();
          }
        });
    },
    clearForm() {
      this.userDetails = {
        U_EMPLOYEE_CODE: null,
        U_ROLE_CODE: null,
        U_IS_ACTIVE: null
      };
      this.selectedUserDetails = {
        ExternalEmployeeNumber: null,
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        eMail: null
      };
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    addUser() {
      this.$bvModal.show("add-user-modal");
    },

    addUserTable() {
      this.isBusy = true;
      this.userDetails.U_USERNAME = this.selectedUserDetails.ExternalEmployeeNumber;
      console.log(this.userDetails);
     
      this.$store
        .dispatch("Admin/Users/addUser", {
          Code: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          user: this.userDetails,
          
          SessionId: localStorage.SessionId
        })
        .then(res => {        
          if (res && res.name == "Error") {
            this.isBusy = false;

            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
            this.isBusy = false;
          } else {
            this.showAlert("Successfully Added", "success");

            this.$bvModal.hide("add-user-modal");

            this.clearForm();

            this.isBusy = false;
          }
        });
    },

    edit(data) { 
      console.log(data);
      this.userDetails = {
        Code: data.Code,
        U_EMPLOYEE_CODE: data.U_EMPLOYEE_CODE,
        U_IS_ACTIVE: data.U_IS_ACTIVE,
        U_IS_SAP_USER: data.ApplicationUserID ? 1 : 0,
        U_ROLE_CODE: data.U_ROLE_CODE,
        U_USERNAME: data.U_USERNAME,
        U_COMPANY_CODE: data.U_COMPANY_CODE,
        U_COMPANY_ACCESS: data.U_COMPANY_ACCESS,
        U_LOCATION_ID: data.U_LOCATION_ID
      };
      this.selectedUserDetails = {
        FirstName: data.FirstName,
        LastName: data.LastName,
        eMail: data.eMail,
        MiddleName: data.MiddleName
      };
      this.$bvModal.show("edit-modal");
    },
    editTable() {
      this.isBusy = true;
      console.log(this.userDetails);
      this.$store
        .dispatch("Admin/Users/editUser", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          userForm: this.userDetails,
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
          } else {
            this.isBusy = false;
            this.showAlert("Successfully Updated", "success");

            this.$bvModal.hide("edit-modal");

            this.clearForm();
          }
        });
    },

    resetpassword(data) {
      this.userDetails = { ...data };

      this.$bvModal.show("reset-modal");
    },

    fetchPendingTransactions() {
      this.items = this.$store.state.transactions.pendingTransactions;
      return;
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    }
  },

  async beforeCreate() {

    this.isBusy = true;
    
    await this.$store
      .dispatch("Admin/Company/fetchListCompany", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId,
        Admin: "Y"
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
            if (res.response.data.errorMsg === "Session restore error.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });
     await this.$store
      .dispatch("SAP/Companies/fetchCompanyList", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
            if (res.response.data.errorMsg === "Session restore error.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });
      this.listCompanies.forEach(company => {
        this.filterCompany.push(company.U_COMPANYCODE)
      })

    await this.$store
      .dispatch("Admin/Users/fetchUsers", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId
      })
      .then(res => {
        if(!this.filter) {
          this.totalRows = this.filterItems ? this.filterItems.length : 0
        }
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });
    await this.$store.dispatch("Admin/Roles/fetchRoles", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

      await this.$store.dispatch("Admin/Location/fetchListLocations").then( res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.error) {
            if (res.response.data.error === "Session expired") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    // this.$store.dispatch("Accounting_Group/fetchAccountingGroup", {
    //   token: localStorage.token
    // });
      this.isBusy = false;

  },
  async created() {
    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];
    const user_details = JSON.parse(localStorage.user_details);
    

    if (userActions.find(action => action.U_ACTION_NAME === "Add user")) {
      this.actions.addUser = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "Edit user")) {
      this.actions.editUser = true;
    }
    if (
      userActions.find(action => action.U_ACTION_NAME === "Reset user password")
    ) {
      this.actions.resetPassword = true;
    }
    if (
      userActions.find(action => action.U_ACTION_NAME === "Update SAP user")
    ) {
      this.actions.updateUser = true;
    }
    // await this.getLocations();
  }
};
</script>
