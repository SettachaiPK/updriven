<template>
  <div v-if="user">
    <div v-if="isFetching">
    <div class="d-flex ai-center jc-space-between">
      <h6 class="fw-600 color-01">Following</h6>
      <p class="xxs fw-500 color-gray">{{profile.followings.length}} following</p>
    </div>
    <div v-if="profile.followings.length > 0">

      <div class="gallery-grids" style="--ggs:.375rem;">
          <div v-for="(following,i) in profile.followings" :key="i" class="grid sm-1-3 mt-2">
            <a class="ss-img square bradius-1" >
              <div class="img-bg" :style="'background-image:url(\''+following.follow.user_detail[0].profile_pic+'\');'"></div>
            </a>
            <p class="xxxs fw-600 lh-3xs mt-1">{{following.follow.user_detail[0].firstname}} </p>
          </div>
          
      </div>
      <div class="mt-2">
          <!-- <router-link class="p xxs fw-600 color-gray h-color-01" :class="activeIndex==3? 'active': ''"  -->
          <router-link class="p xxs fw-600 color-gray h-color-01"
            :to="{ name: 'UserProfileFollowingPage', params: { id: profile.id, username: profile.firstname + '_' + profile.lastname } }"
          >Load More
          </router-link>
        </div>

    </div>
    <div v-else>
      <p class="xxxs fw-600 lh-3xs mt-1">No following </p>
    </div>
    </div>

  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"

export default {
  name: 'SectionFriends',
  data() {
    return {
      // user: this.$store.getters.user,
      userId: ( this.$route.params.id === undefined? 'Not found' : this.$route.params.id ),
      friends: [],
      isFetching: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'authentication/user',
      profile: 'profile/information',
    }),
    
  },
  async mounted() {
    const userID = ( this.userId === 'Not found'? this.profile.id : this.$route.params.id )
    await this.getFollowing({ userId: userID })
    this.isFetching = true
  },
  methods: {
    
    ...mapActions({
      getFollowing: 'profile/getFollowing',
    }),
    
  }
}
</script>
