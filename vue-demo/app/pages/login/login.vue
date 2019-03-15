<template>
	<transition name="slide-up" mode="out-in">
		<v-elem>
			<div>Login XXX</div>
			<v-group :title="login.title" :show="login.show">
				<v-input :dataKey="login"></v-input>
				<v-input :dataKey="login"></v-input>
			</v-group>

			<v-group title="xxxx">
				<v-radio :dataKey="radio"></v-radio>
				<v-input :dataKey="login"></v-input>
			</v-group>
			<div>{{radio.key}}</div>

			<v-group title="">
				<v-select :dataKey="select"></v-select>
			</v-group>
			<v-group title="复选框">
				<v-checkbox :dataKey="formData.checkbox"></v-checkbox>
			</v-group>
			<v-group title="开关" >
				<v-checkbox :dataKey="formData.box"></v-checkbox>
			</v-group>

			<div>
				<v-button title="确定" :callback="showDialog" css="btn-primary"></v-button>
				<v-button title="取消"></v-button>
			</div>
			<div>
				<v-dialog :dialog="dialog">
					<div>Login XXX1</div>
				</v-dialog>
			</div>
			<div>
				<v-alert :alert="alert">
					<div>This is a alert!</div>
					<div>Login XXX</div>
				</v-alert>
			</div>
			<v-elem :show="xxxx">
				<div>Login XXX1</div>
				<v-elem v-if="test">Login XXX</v-elem>
			</v-elem>
			<div @click="getMode('123')">点击mode</div>
			<v-group title="开关">
				<v-switch :dataKey="formData.switch" ></v-switch>
			</v-group>
			<v-progress :percent="percent" text-align="right" interval-time="2000" :handler-callback="progressBack" ></v-progress>
			<div @click="add()">xxx</div>
			<div>{{count}}</div>
		</v-elem>

	</transition>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	export default {
		//inject:["translate"],
		created() {
			console.log("login created");
		},
		computed: mapState({
			count: state => state.count,
			mode: state => state.global.mode
		}),
		/*computed: {
			...mapState(["global.mode", "count"])
		},*/
		mounted() {
			//console.log("login mounted");
			//this.translate();
			let _this = this;
			setTimeout(function() {
				//_this.formData.checkbox.key = ["1", "2"];
			}, 3000);

		},
		data() {
			return {
				//mode: "",
				xxxx: true,
				test: false,
				percent: 96,
				login: {
					required: true,
					css: "x123",
					title: _("Login"),
					placeholder: "asdasda",
					key: "",
					type: "password",
					hasEye: true,
					//disabled: true,
					valid: {
						type: "num",
						args: [1, 23]
					}
				},
				radio: {
					title: _("Login"),
					options: {
						"1": "label 1",
						"2": "label 2",
						"0": "label 0"

					},
					/*sortArray: [{
						value: "2",
						title: "label 2"
					},{
						value: "1",
						title: "label 1"
					},{
						value: "0",
						title: "label 0"
					}],*/
					key: "0",
					changeCallBack(value) {
						console.log("radio value ",value);
					}
				},
				select: {
					key: "",
					hasManual: true,
					maxLength: 12,
					manualText: "手动设置",
					sortArray:[{
						title: "optionxxxxxxxxxxxxxxxxxxxxxx 1",
						value:  "1"
					},{
						title: "optionxxxxxxxxxxxxxxxxxx 2",
						value:  "2"
					},{
						title: "option 3",
						value:  "3"
					}],
					valid: {
						type: "ascii"
					},
					changeCallBack: this.selectCallBack
				},
				dialog: {
					title: "Title",
					show: false,
					okCallBack: function() {
						console.log("click dialog ok");
					}
				},
				alert: {
					title: "Title",
					show: false,
					css: "",
					okCallBack: () => {
						console.log("click alert OK");
					},

				},
				confirm: {
					show: false,
					callback: (clickOk) => { //
						console.log("click confitm " + clickOk);
					}
				},
				formData: {
					checkbox: {
						title: _("Login"),
						options: {
							"2": "label 2",
							"0":  "label 0",
							"1":  "label 1"
						},
						/*sortArray: [{
							value: "2",
							title: "label 2"
						},{
							value: "0",
							title: "label 0"
						},{
							value: "1",
							title: "label 1"
						}],*/
						key: ["2"],
						changeCallBack(value) {
							console.log("radio value ",value);
						}
					},
					switch: {
						title: _("开关"),
						key: false,
						changeCallBack(value) {
							console.log("开关 value ",value);
						}
					},
					box: {
						title: _("xxxxxx"),
						values: ["1", "0"],
						key: "1",
						changeCallBack(value) {
							console.log("checkbox value ", value);
						}
						//key: true,
					}

				}
			};
		},
		methods: {
			...mapActions([
			    'getMode'
			 ]),
			add() {
				this.$store.dispatch('increment');
			},
			selectCallBack(value) {
				console.log(this.select.key);
			},
			showDialog() {
				this.checkSubmit(this.formData);
				//this.test = true;
				//this.alert.show = true;
				//this.confirm.show = true;
				//this.$message("xxxxx");
				//this.$confirm("xxxx");
				/*this.$alert({
					content: "<div>xxxxx</div>",
					parseHtml: true,
					title: "123"
				}).then((val)=>{
					console.log("################## ", val);
				}).catch(()=> {})*/
			},
			progressBack() {
				console.log("progress Back");
			}
		}
	};
</script>