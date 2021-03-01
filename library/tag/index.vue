<script>
	import Tag from "../../src/tag";
	export default {
		render(h) {
			return h("div", [
				...this.dynamicTags.map((tag) => {
					return h(
						Tag,
						{
							attrs: {
								closable: true,
								"disable-transitions": false,
							},
							on: {
								close: () => {
									this.handleClose(tag);
								},
							},
						},
						tag
					);
				}),
				this.inputVisible
					? h("el-input", {
							class: "input-new-tag",
							attrs: {
								value: this.inputValue,
								size: "small",
							},
							ref: "saveTagInput",
							on: {
								blur: this.handleInputConfirm,
								input: (v) => {
									this.inputValue = v;
								},
							},
					  })
					: h(
							"el-button",
							{
								class: [
									"button-new-tag",
									{ "button-visible": this.hidden },
								],
                                style:{
                                    marginLeft:this.dynamicTags.length>0?"10px":"0px"
                                },
								attrs: {
									size: "small",
								},
								on: {
									click: this.showInput,
								},
							},
							this.title || "+ 新增"
					  ),
			]);
		},
		data() {
			return {
				copy: [],
				inputVisible: false,
				inputValue: "",
			};
		},
		props: {
			tags: Array,
			title: String,
			hidden: {
				type: Boolean,
				default: false,
			},
			json: {
				type: Boolean,
				default: false,
			},
		},
		computed: {
			dynamicTags() {
				return this.copy.length > 0 ? this.copy : [];
			},
		},
		methods: {
			handleClose(tag) {
				this.$emit("ad-tag", tag, false);
				this.copy.splice(this.dynamicTags.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick((_) => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.$emit("ad-tag", inputValue, true);
					this.copy.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = "";
			},
		},
		created() {
			this.copy = Array.from(this.tags);
		},
	};
</script>
<style scoped>
.uw-tag + .uw-tag {
	margin-left: 10px;
}
.button-new-tag {
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
.button-visible {
	display: none;
}
</style>
