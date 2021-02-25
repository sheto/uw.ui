<template>
	<Image :src="url" />
</template>
<script>
	import Profile from "__dirname/config/profile.info";
	import { Image } from "element-ui";
	export default {
		name: "uw-image",
		components: { Image },
		props: {
			src: {
				type: String,
				required: true,
			},
		},
        computed:{
            url(){
                return Profile.uploadPrefix+this.src;
            }
        }
	};
</script>

