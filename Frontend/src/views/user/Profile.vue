<template>
  <TopNav />
  <div class="app-container">

    <div class="left-container">
      <div class="wrapper" data-simplebar>
        <LeftNav @on-click="(tab) => onClickTab(tab)" />
      </div>
    </div>

    <Banner ref="bannerContainer" :activeIndex="bannerActiveIndex" />

    <div ref="rightContainer" class="right-container" :class="rightContainerClass">
      <div class="wrapper" data-simplebar>
        <div class="p-3 bshadow">
          <SectionInfo />
        </div>
        <div class="p-3 bshadow mt-4">
          <SectionPhotos />
        </div>
        <div class="p-3 bshadow mt-4">
          <SectionFriends />
        </div>
        <div class="p-3 bshadow mt-4">
          <SectionInterested />
        </div>
      </div>
    </div>

    <div class="middle-container">
      <PostNew @on-post="(post) => createPost(post)" />
      <PostMultiple ref="posts" :typePost="false"/>
    </div>

  </div>
</template>

<script>
import { onMounted } from '../../helpers/frontend';
import TopNav from '../../components/TopNav';
import LeftNav from '../../components/LeftNav';
import PostNew from '../../components/PostNew';
import PostMultiple from '../../components/PostMultiple';
import Banner from '../../components/Banner';
import SectionInfo from '../../components/SectionInfo';
import SectionPhotos from '../../components/SectionPhotos';
import SectionFriends from '../../components/SectionFriends';
import SectionInterested from '../../components/SectionInterested';
import SectionLive from '../../components/SectionLive';
import {mapGetters, mapActions, mapState, mapMutations} from "vuex"

export default {
  name: 'UserProfilePage',
  components: {
    TopNav,
    LeftNav,
    PostNew,
    PostMultiple,
    Banner,
    SectionInfo,
    SectionPhotos,
    SectionFriends,
    SectionInterested,
    SectionLive
  },
  data() {
    return {
      bannerActiveIndex: 1,
      rightContainerClass: '',
      userId: ( this.$route.params.id === undefined? 'Not found' : this.$route.params.id ),
      following:[],
    }
  },
  async created() {
    await window.scrollTo(0,0);
    const userID = ( this.userId === 'Not found'? this.profileInfo.id : this.$route.params.id )
    await this.clearPost();
    await this.changeOptionType(0);
    await this.fetchInfoProfile({ userId: userID })
    await this.getPost({ userID: userID });
  },
  mounted() {
    onMounted();
    this.onScroll();
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },
  computed: {
    ...mapGetters({
      user: 'authentication/user',
      profileInfo: 'profile/information',
      isDashboard: 'post/isDashboard',
      haveFilter: 'post/haveFilter',
    })
  },
  methods: {
    ...mapActions({

      getPost:'post/getPost',
      fetchInfoProfile: 'profile/fetchInfo',
      clearPost: 'post/clearPost',

    }),

    ...mapMutations({
      changeOptionType: 'post/changeOptionType'
    }),

    onScroll() {
      if(this.$refs.rightContainer && this.$refs.bannerContainer) {
        if(window.scrollY < this.$refs.bannerContainer.getHeight()+16) {
          this.rightContainerClass = '';
        } else {
          this.rightContainerClass = 'sticky';
        }
      }
    },

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
