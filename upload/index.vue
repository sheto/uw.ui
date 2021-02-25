<script>
	import Profile from "__dirname/config/profile.info";
	export default {
		render(h) {
			return h(
				"el-upload",
				{
					class: "avater-uploader",
					props: {
						action: this.uploadUrl,
						data: this.uploadData,
						limit: this.limit,
						headers: this.headers,
						fileList: this.FILE_LIST,
						listType: "picture-card",
						beforeUpload: this.beforeUpload,
						name: "merchantPic",
						onSuccess: this.afterUploadSuccess,
						onError: this.afterUploadError,
						onRemove: this.whenRemoveFile,
					},
				},
				[h("i", { class: "el-icon-plus avatar-uploader-icon" })]
			);
		},
		data() {
			return {
				uploadData: {
					key: "",
				},
				token: "",
				filename: "",
				uploadUrl: Profile.project.uploadURL,
				img_url: "",
				fileList: [],
				headers: {
					[Profile.project.authKey]: this.$db.get("token"),
				},
			};
		},
		computed: {
			FILE_LIST() {
				return this.fileList.map((item) => {
					return {
						url: `${Profile.project.uploadPrefix}/${item.url}`,
					};
				});
			},
		},
		props: {
			limit: {
				type: Number,
				default: 1,
			},
			payload: [Array, String],
			list: [Array, Object],
		},
		methods: {
			whenRemoveFile(remove, file) {
				if (remove.status && remove.status === "uploading") return;
				if (/blob:/.test(remove.url)) return;
				let fileName = remove.url.match(/\d+\..{1,}$/g)[0];
				let existFileList = this.fileList.filter(
					(item) => item.url.match(/\d+\..{1,}$/g)[0] !== fileName
				);
				this.$emit("remove", existFileList, this.payload);
			},
			//获取上传的token
			getUploadToken() {
				this.$post(profile.project.uploadToken).then((res) => {
					if (res.data) {
						this.uploadData.token = res.data.token;
						this.token = res.data.token;
					}
				});
			},
			//上传前判断
			beforeUpload(file) {
				let _date = new Date();
				let _suffix = file.name.match(/\..{1,}$/g)[0];
				//改名字
				let _filename = `upload/${
					String(_date.getFullYear()) +
					String(_date.getUTCMonth() + 1) +
					String(_date.getUTCDate())
				}/${_date.getTime() + _suffix}`;
				this.filename = _filename;
				this.uploadData.key = _filename;
				const isJPG = file.type === "image/jpeg";
				const isPNG = file.type === "image/png";
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG && !isPNG) {
					this.$message.error("图片只能是 JPG/PNG 格式!");
					return false;
				}
				if (!isLt2M) {
					this.$message.error("图片大小不能超过 2MB!");
					return false;
				}
			},
			//上传图片 项目
			afterUploadSuccess(file) {
				let { data } = file;
				if (/blob:/.test(data.url)) return;
				this.$emit("upload", data.name, this.payload);
			},
			afterUploadError(res) {
				this.$message.error("图片上传发生错误!");
			},
		},
		created() {
			if (this.list) {
				if (Array.isArray(this.list)) {
					// 更新文件列表
					if (this.list.length > 0) {
						this.fileList = [...this.list];
					}
				} else {
					this.fileList.push(this.list);
				}
			}
		},
	};
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload--picture-card {
	width: 60px;
	height: 60px;
	line-height: 60px;
}
.avatar-uploader .el-upload-list--picture-card .el-upload-list__item {
	width: 60px;
	height: 60px;
}
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 60px;
	height: 60px;
	line-height: 60px;
	text-align: center;
}
</style>
