<template>
  <TopNav />
  <div class="app-container">

    <div class="left-container">
      <div class="wrapper" data-simplebar>
        <LeftNav @on-click="(tab) => onClickTab(tab)" />
      </div>
    </div>
    
    <div class="right-container">
      <div class="wrapper" data-simplebar>
        <div>
          <SectionSponsored />
        </div>
      </div>
    </div>

    <div class="middle-container">
      <PostNew @on-post="(post) => createPost(post)" />
      <PostMultiple ref="posts" :typePost="true"/>
    </div>

  </div>
</template>

<script>
import TopNav from '../../components/TopNav';
import LeftNav from '../../components/LeftNav';
import PostNew from '../../components/PostNew';
import PostMultiple from '../../components/PostMultiple';
import SectionSponsored from '../../components/SectionSponsored';
import SectionLive from '../../components/SectionLive';
import {mapGetters, mapActions, mapState, mapMutations} from "vuex";

export default {
  name: 'UserDashboardPage',
  components: {
    TopNav,
    LeftNav,
    PostNew,
    PostMultiple,
    SectionSponsored,
    SectionLive
  },
  async created() {
    await this.clearPost();
    await this.changeOptionType(1);
    await this.getFeed();

    // console.log( this.$route)
  },
  mounted() {
    AOS.init({ easing: 'ease-in-out-cubic', duration: 750, once: true, offset: 10 });
  },
  computed: {
    ...mapGetters({
      isDashboard: 'post/isDashboard',
      haveFilter: 'post/haveFilter',
    })
  },
  methods: {
    ...mapActions({
      getFeed:'post/getFeed',
      clearPost: 'post/clearPost'
    }),

    ...mapMutations({
      changeOptionType: 'post/changeOptionType'
    }),

    createPost(post) {
      this.$refs['posts'].createPost(post);
    },
    
    onClickTab(tab) {
      if(tab.link=='javascript:'){
        this.$refs['posts'].updateCategory(tab);
      }else{
        window.location.href = tab.link;
      }
    },
  }
}
</script>
