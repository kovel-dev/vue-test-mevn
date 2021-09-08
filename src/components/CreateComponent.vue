<template>
	<div class="row justify-content-center">
		<div class="col-md-10">
			<h3 class="text-center">Create New Client</h3>
			<form @submit.prevent="handleSubmitForm">
				<div class="form-group">
					<label>Name</label>
					<input type="text" class="form-control" v-model="client.name" required>
				</div>

				<div class="form-group">
					<label>Email</label>
					<input type="email" class="form-control" v-model="client.email" required>
				</div>

				<div class="form-group">
					<label>Phone</label>
					<input type="text" class="form-control" v-model="client.phone" required>
				</div>

				<div class="form-group">
					<label for="">Provider</label>
					<div class="d-flex">
						<input type="text" class="form-control" v-model="provider">
						<button class="btn btn-dark w-max-content ml-2" @click="addProvider" style="width: 180px">Add Provider</button>
					</div>

					<b-list-group class="provider-box mt-3">
						<div v-if="defaultProviders.length > 0">
							<b-list-group-item v-for="provider in defaultProviders" :key="provider._id" class="py-2 d-flex align-items-center justify-content-between">
								<div>
									<input type="checkbox" :value="provider" v-model="client.providers" class="mr-2" :id="provider._id"> <label :for="provider._id" class="mb-0">{{ provider.name }}</label>	
								</div> 
								<b-icon icon="trash" @click="removeHandler( provider._id, provider.name )"></b-icon>
							</b-list-group-item>
						</div>
						<div class="py-2 list-group-item" v-else>
							Nothing else!
						</div>
					</b-list-group>

				</div>

				<div class="form-group mt-5 text-right">
					<button class="btn btn-black" @click="closeCreateModal">Cancel</button>
					<button class="btn btn-danger">Add Client</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import axios from "axios";

	export default {
		props: {
			addClient: { type: Function },
			updateClient: { type: Function }
		},
		data() {
			return {
				provider: '',
				defaultProviders: [],
				client: {
					name: '',
					email: '',
					phone: '',
					providers: [],
				},
			}
		},
		created() {
			let providerURL = `http://localhost:4000/provider/`;

			axios.get(providerURL).then((res) => {
				this.defaultProviders = res.data;
			})
		},
		methods: {
			handleSubmitForm() {
				let apiURL = 'http://localhost:4000/api/create-client';
							
				axios.post(apiURL, this.client).then((res) => {
					this.addClient( res.data )
					this.client = {
						name: '',
						email: '',
						phone: '',
						providers: []
					}
				}).catch(error => {
					console.log(error)
				});
			},
			closeCreateModal(e) {
				e.preventDefault()
				this.$root.$emit('bv::hide::modal', 'createModal', '#newClient')
			},
			addProvider(e) {
				e.preventDefault()

				let providerURL = `http://localhost:4000/provider/add-provider`;

				if ( this.provider !== '' ) {
					axios.post(providerURL, {name: this.provider}).then((res) => {
						this.defaultProviders.push(res.data)
					}).catch(error => {
						console.log(error)
					});
				}

				this.provider = ''
			},
			removeHandler( id, name ) {
				let providerURL = `http://localhost:4000/provider/delete-provider/${id}/${name}`;
				let indexOfArrayItem = this.defaultProviders.findIndex(i => i._id === id);

				if (window.confirm("Do you really want to delete?")) {
					axios.delete(providerURL).then((res) => {
						this.updateClient( res.data.cliData )
						this.defaultProviders.splice(indexOfArrayItem, 1);
					}).catch(error => {
						console.log(error)
					});
				}
			},
		}
	}
</script>

<style>
.provider-box {
	border: 1px solid #ced4da;
	width: calc(100% - 132px);
	transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	border-radius: .25rem;
	padding: .375rem .75rem;
	font-size: 1rem;
	background-clip: padding-box;
}
</style>