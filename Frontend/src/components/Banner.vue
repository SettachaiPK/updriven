<template>
  <div v-if="profileInfo" ref="bannerContainer" class="banner-container bshadow ovf-hidden">
    <div class="img-bg" :style="'background-image:url(\''+profileInfo.background+'\');'"></div>
    <div class="content-container">
      <div class="top-container">
        <div class="avatar-container">
          <Avatar :avatar="profileInfo.avatar" classer="xxl border-4 bcolor-white" />
        </div>
        <div class="text">
          <h6 class="p lg fw-500">
            {{ profileInfo.firstname }} {{ profileInfo.lastname }}
          </h6>
            <div v-if="profileInfo.role">
              <p v-if="profileInfo.role.is_admin === true" class="xxs fw-500 color-gray">
                Role : Admin
              </p>
              <p v-else-if="profileInfo.role.is_corporate" class="xxs fw-500 color-gray">
                Role : Corporate
              </p>
              <p v-else-if="profileInfo.role.is_learner" class="xxs fw-500 color-gray">
                Role : Learner
              </p>
              <p v-else-if="profileInfo.role.is_mentor" class="xxs fw-500 color-gray">
                Role : Mentor
              </p>
            </div>
            <div v-else>
              <p class="xxs fw-500 color-gray">
                Role : Nothing 
              </p>
            </div>
            
          <p class="xxs fw-500 color-gray">
            {{stateFullName && stateFullName!='-'? stateFullName: ''}}{{
              stateFullName && stateFullName!='-' && countryFullName
                ? ', '+countryFullName: countryFullName
            }}
            </p>
        </div>
      </div>
      <div class="d-flex ai-center jc-space-between fw-wrap mt-3">
        <div class="tabs">

          <router-link 
            class="tab" :class="activeIndex==0? 'active': ''" 
            :to="{ name: 'UserProfileAboutPage', params: { id: profileInfo.id, username: profileInfo.firstname + '_' + profileInfo.lastname } }"
          >About</router-link>

          <router-link 
            class="tab" :class="activeIndex==1? 'active': ''" 
            :to="{ name: 'UserProfilePage', params: { id: profileInfo.id, username: profileInfo.firstname + '_' + profileInfo.lastname } }"
          >Post</router-link>

          <router-link 
            class="tab" :class="activeIndex==2? 'active': ''" 
            :to="{ name: 'UserProfileFollowingPage', params: { id: profileInfo.id, username: profileInfo.firstname + '_' + profileInfo.lastname } }"
          >Following</router-link>

          <router-link 
            class="tab" :class="activeIndex==3? 'active': ''" 
            :to="{ name: 'UserProfileImagePage', params: { id: profileInfo.id, username: profileInfo.firstname + '_' + profileInfo.lastname } }"
          >Image</router-link>
          
        </div>
        <div v-if="isFetching">
        <div class="btn d-flex">
          <div  v-if="checkNotSelf">
            <Button  v-if="!checkFollow"
              text="FOLLOW" v-on:click="followMethod(profileInfo.id)" 
              classer="d-block btn-color-03 btn-sm pl-4 pr-4 mr-2" 
            />
            <Button  v-else
              text="UNFOLLOW" v-on:click="unFollowMethod(profileInfo.id)" 
              classer="d-block btn-color-03 btn-sm pl-4 pr-4 mr-2" 
            />
          </div>
          <div v-else>
          <Button 
            href="/user/profile/update" text="EDIT PROFILE" 
            classer="d-block btn-color-03 btn-sm pl-4 pr-4" 
          />
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"

export default {
  name: 'Banner',
  props: {
    activeIndex: { type: Number, default: 0 }
  },
  data() {
    return {
      // user: this.user
      following:[],
      checkFollow:false,
      checkNotSelf:false,
      isFetching:false,
    }
  },
  async mounted() {
    const userID = ( this.$route.params.id === undefined ? this.profileInfo.id : this.$route.params.id )
    this.getFollowing({ userId: this.user.id }).then(response => {
      for(let i = 0; i < this.user.followings.length; i++){
        this.following.push(this.user.followings[i].follow._id)
      }
      if(!( userID === this.user.id )){
        this.checkNotSelf = true
      }
      if(this.following.includes(this.profileInfo.id) ){
        this.checkFollow = true
      }
      this.isFetching= true
    })
  },

  computed: {
    ...mapGetters({
      user: 'authentication/user',
      countryFullName: 'csc/countryFullName',
      stateFullName: 'csc/stateFullName',
      profileInfo: 'profile/information',
    })
  },

  methods: {
    getHeight() {
      if(this.$refs.bannerContainer) {
        return this.$refs.bannerContainer.clientHeight;
      } else {
        return 0;
      }
    },
    followMethod(id){
      this.follow({userId: id})
      this.checkFollow = true
      this.increaseFollowed()
    },
    unFollowMethod(id){
      this.unFollow({userId: id})
      this.checkFollow = false
      this.decreaseFollowed()
    },
    ...mapActions({
      getFollowing: 'authentication/getFollowing',
      follow: 'authentication/follow',
      unFollow: 'authentication/unFollow',
    }),
    ...mapMutations({
      increaseFollowed: 'profile/increaseFollowed',
      decreaseFollowed: 'profile/decreaseFollowed',
    })
  }
}
</script>
