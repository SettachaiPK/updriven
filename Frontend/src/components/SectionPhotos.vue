<template>
    <h6 class="fw-600 color-01">Images</h6>
      <div v-if="photos.length >0">
        <div class="gallery-grids grid-round mt-1" style="--ggs:.125rem;">
          <div v-for="(image, i) in photos" :key="i" class="grid sm-1-3">
            <a class="ss-img square"  >
              <div class="img-bg" :style="'background-image:url(\''+image.path+'\');'"></div>
            </a>
          </div>
        </div>


        <div class="mt-2">
          <!-- <router-link class="p xxs fw-600 color-gray h-color-01" :class="activeIndex==3? 'active': ''"  -->
          <router-link class="p xxs fw-600 color-gray h-color-01" 
            :to="{ name: 'UserProfileImagePage', params: { id: profile.id, username: profile.firstname + '_' + profile.lastname } }"
            >Load More
          </router-link>
        </div>
      </div>

      <div v-else class="gallery-grids grid-round mt-1" style="--ggs:.125rem;">
        <div class="p xxs fw-600 color-gray " 
            >No Image
        </div>
      </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"

export default {
  name: 'SectionPhotos',
  data() {
    return {
      // user: this.$store.getters.user,
      photos: [],
      userId: ( this.$route.params.id === undefined? 'Not found' : this.$route.params.id ),
    }
  },
  computed: {
    ...mapGetters({
      user: 'authentication/user',
      profile: 'profile/information'
    })
  },
  async mounted() {
    const userID = ( this.userId === 'Not found'? this.profile.id : this.$route.params.id )
    await this.getImages({ userId: userID })
    if(this.profile.images.length > 9){
      for (let i = 0; i < 9; i++) { 
        this.photos.push(this.profile.images[i]) 
      }
    }
    else if(this.profile.images.length > 0 && this.profile.images.length < 9){
      for (let i = 0; i < this.profile.images.length; i++) { 
        this.photos.push(this.profile.images[i]) 
      }
    }

  },
  methods: {
    ...mapActions({
      getImages: 'profile/getImages'
    }),
  }
}
</script>
