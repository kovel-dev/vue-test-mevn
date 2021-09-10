<template>
	<div class="row">
		<div class="col-md-12">
			<div class="d-flex w-100 justify-content-between align-items-center bg-gray py-3 px-4">
				<div class="d-flex justify-content-between align-items-center">
					<h3 class="mb-0">Clients</h3>
					<input type="text" class="form-control ml-3" placeholder="Search & Filter" @change="filterClients" @input="filterClients" v-model="filterInput" >
				</div>
				<b-button v-b-modal.createModal ref="newClient">New Client</b-button>
			</div>
		</div>
		<div class="col-md-12">
			<table class="table table-striped">
				<thead class="thead-dark">
					<tr>
						<th @click="sort('name')" :class="'cursor-pointer ' + sortedClass('name')"><span>Name</span></th>
						<th @click="sort('email')" :class="'cursor-pointer ' + sortedClass('email')"><span>Email</span></th>
						<th @click="sort('phone')" :class="'cursor-pointer ' + sortedClass('phone')"><span>Phone</span></th>
						<th>Providers</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="client in sortedClients" :key="client._id">
						<td>{{ client.name }}</td>
						<td>{{ client.email }}</td>
						<td>{{ client.phone }}</td>
						<td>
							<span v-for="provider in client.providers" :key="provider._id">
								{{ provider.name + ", " }}
							</span>
						</td>
						<td>
							<b-button v-b-modal.editModal @click="callEditComp(client._id)" ref="editClient">Edit</b-button>
							<button @click.prevent="deleteClient(client._id)" class="btn btn-danger ml-2">Delete</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<b-modal id="createModal" title="Create Client" hide-footer >
			<CreateComponent :addClient="addClient" :updateClient="updateClient" />
		</b-modal>
		<b-modal id="editModal" title="Edit Client" hide-footer >
			<EditComponent :editID="editID" :editClient="editClient" :updateClient="updateClient" />
		</b-modal>
	</div>
</template>

<script>
	import axios from "axios";
	import CreateComponent from './CreateComponent.vue'
	import EditComponent from './EditComponent.vue'

	export default {
		components: {
			CreateComponent,
			EditComponent
		},
		data() {
			return {
				Clients: [],
				Filtered: [],
				editID: "",
				currentSort: 'name',
				currentSortDir: 'asc',
				filterInput: ''
			}
		},
		created() {
			let apiURL = 'http://localhost:4000/api';

			axios.get(apiURL).then(res => {
				this.Clients = res.data;
				this.Filtered = res.data;
			}).catch(error => {
				console.log(error)
			});
		},
		methods: {
			deleteClient(id){
				let apiURL = `http://localhost:4000/api/delete-client/${id}`;
				let indexOfArrayItem = this.Clients.findIndex(i => i._id === id);

				if (window.confirm("Do you really want to delete?")) {
					axios.delete(apiURL).then(() => {
						this.Clients.splice(indexOfArrayItem, 1);
					}).catch(error => {
						console.log(error)
					});
				}
			},
			callEditComp(id) {
				this.editID = id
			},
			addClient( newClient ) {
				this.Clients.push( newClient )
			},
			editClient( editedClient ) {
				const index = this.Clients.findIndex((client) => client._id === editedClient._id )
				this.Clients.splice(index, 1, editedClient)
			},
			updateClient( updatedClient ) {
				this.Clients = updatedClient
			},
			sort: function(s) {
				if( s === this.currentSort ) {
					this.currentSortDir = this.currentSortDir === 'asc'?'desc':'asc';
				}
				this.currentSort = s;
			},
			sortedClass: function(s) {
				return this.currentSort === s ? `sorted ${this.currentSortDir}` : ''
			},
			filterClients() {
				this.Filtered = this.Clients.filter(client => {
					const name = client.name.toString().toLowerCase()
					const email = client.email.toString().toLowerCase()
					const phone = client.phone.toString().toLowerCase()

					return  name.includes( this.filterInput.toLowerCase() ) || 
									email.includes( this.filterInput.toLowerCase() ) || 
									phone.includes( this.filterInput.toLowerCase() ) 
				})
			}
		},
		computed: {
			sortedClients() {
				return [...this.Filtered].sort((a, b) => {
					let modifier = 1;
					if(this.currentSortDir === 'desc') { 
						modifier = -1;
					}
					if(a[this.currentSort] < b[this.currentSort]) {
						return -1 * modifier;
					}
					if(a[this.currentSort] > b[this.currentSort]) {
						return 1 * modifier;
					}
					return 0;
				})
			}
		},
		watch: {
			Clients( newVal ) {
				this.Filtered = newVal
			}
		}
	}
</script>

<style>
	.btn-success {
		margin-right: 10px;
	}
	.bg-gray {
		background-color: lightgray;
	}
	.cursor-pointer {
		cursor: pointer;
	}
	table th.sorted.asc::after {
		display: inline-block;
		content: '▼';
		margin-left: 10px;
	}
	table th.sorted.desc::after {
		display: inline-block;
		content: '▲';
		margin-left: 10px;
	}
</style>