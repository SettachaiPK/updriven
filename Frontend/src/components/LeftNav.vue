<template>
  <nav v-if="user" class="leftnav">
    <div class="menu-container">
      <div class="menu menu-tab active mb-6" @click="refreshPage()">
        <router-link to="/user/dashboard">
          <div class="icon">
            <img src="/assets/img/icon/home-white.png" alt="Image Icon" />
          </div>
          Home
        </router-link>
      </div>

      <div 
        v-for="(tab, i) in menu" :key="i" 
        class="menu" :class="{
          'has-children': tab.children && tab.children.length,
          'active': tab.status 
        }"
      >
        <a :href="tab.link" @click="onClick(tab)">
          {{tab.title}} 
          <div v-if="tab.children && tab.children.length" class="chev">
            <img src="/assets/img/icon/chev-down-02.png" alt="Image Icon" />
          </div>
        </a>
        <div 
          v-if="tab.children && tab.children.length" 
          class="submenu-container" v-show="tab.status" 
        >
          <div class="wrapper" data-simplebar>
            <div 
              v-for="(subtab, j) in tab.children" :key="j" class="submenu" 
              :class="{ 'w-full': !subtab.type || subtab.type != 'avatar' }"
            >
              <a v-if="subtab.type == 'avatar'" :href="subtab.link" @click="onClick(subtab)">
                <Avatar :avatar="subtab.title" />
              </a>
              <a v-else :href="subtab.link" @click="onClick(subtab)">
                {{subtab.title}}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="menu mt-2">
        <a href="https://updriven.com/privacypolicy" target="_blank">
          Privacy Policy
        </a>
      </div>
      <div class="menu">
        <a href="https://updriven.com/support" target="_blank">
          Support
        </a>
      </div>
      <div class="menu">
        <a href="https://updriven.com/contact" target="_blank">
          Contact Us
        </a>
      </div>
      
    </div>
  </nav>
</template>

<script>
import { categoryService } from '../services'
import {mapGetters, mapActions, mapMutations} from "vuex"

export default {
  name: 'LeftNav',
  data() {
    return {
      menu: [
        {
          status: true,
          title: 'Careers', link: 'javascript:',
          icon: '/assets/img/profile/03.jpg',
          children: []
        },
        // {
        //   status: false,
        //   title: 'Groups', link: 'javascript:',
        //   children: [
        //     { type: 'avatar', title: '/assets/img/profile/05.jpg', link: '#' },
        //     { type: 'avatar', title: '/assets/img/profile/06.jpg', link: '#' },
        //     { type: 'avatar', title: '/assets/img/profile/07.jpg', link: '#' },
        //     { type: 'avatar', title: '/assets/img/profile/08.jpg', link: '#' },
        //     { type: 'avatar', title: '/assets/img/profile/09.jpg', link: '#' }
        //   ]
        // },
        // { 
        //   status: false,
        //   title: 'Events', link: '#'
        // },
        // { 
        //   status: false,
        //   title: 'Reports', link: '#' 
        // },
        // { 
        //   status: false,
        //   title: 'Time tracking', link: '#'
        // },
        // { 
        //   status: false,
        //   title: 'Settings', link: '#'
        // }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'authentication/user',
      profileInfo: 'profile/information',
    }),

    currentRouteName() {
        return this.$route.name;
    }
  },
  mounted() {
    categoryService._list().then(d => {
      this.menu[0].children = d.map(k => {
        return {
          clickType: 'emit', link: 'javascript:',
          title: k.category_name, 
          icon: '/assets/img/profile/04.jpg'
        };
      });
    });
  },
  methods: {
    ...mapActions({
      changeCategoryPost: 'post/changeCategoryPost',
      clearCategory: 'post/clearCategory',
      clearPost: 'post/clearPost',
    }),
    ...mapMutations({
      changeStatusFilter: 'post/changeStatusFilter',
      updateCareersTitle: 'post/updateCareersTitle',
      updateCareersIcon: 'post/updateCareersIcon',
      updateSeachCareer: 'search/updateCareer',
    }),

    async onClick(tab) {
      tab.status = await !tab.status;
      if(tab.clickType && tab.clickType=='emit'){
        await this.changeStatusFilter(1);
        await this.changeCategoryPost({ title: tab.title, icon: tab.icon });
        await this.$emit('on-click', tab);
        await this.$router.push({ name: 'UserDashboardPage', params: { careers: tab.title } });
        return
      } 
      else return true;
      
    },

    async refreshPage() {
      await this.clearCategory();
      // await this.clearPost();
      if ( this.$route.name === 'UserDashboardPage' ) this.$router.go()
      else this.$router.push({
        name: 'UserDashboardPage'
      })
    }
  },
  emits: [ 'on-click' ]
}
</script>
