<template>
  <div v-if="user" class="post bshadow">
    <div class="p-3" v-if="selfPost.shared">     
      <p class="xs fw-500">
        <router-link :to="{ name: 'UserProfilePage', params: { id: selfPost.shared.user, username: selfPost.shared.firstname + '_' + selfPost.shared.lastname } }">
          {{selfPost.shared.firstname}} {{selfPost.shared.lastname}} 
        </router-link>
        shared this post on
        {{formatDate(selfPost.createdAt)}}
      </p>
    </div>

    <template v-if="selfPost.desc.indexOf('https://www.youtube.com/') > -1">
      <div class="ss-img video-view no-hover">
        <iframe
          class="img-bg w-full h-full" border="0" 
          :src="'https://www.youtube.com/embed/'+getYoutubeId(selfPost.desc)"
        ></iframe>
      </div>
    </template>
    <template v-else-if="selfPost.image.length == 1">
      <div 
        v-if="selfPost.image[0].type == 'video/mp4' || selfPost.image[0].path.indexOf('.mp4') > -1" 
        class="ss-img video-view no-hover"
      >
        <video 
          ref="videoPlayer" class="img-bg w-full h-full" border="0" controls 
          oncontextmenu="return false;"
        >
          <source :src="selfPost.image[0].path" :type="selfPost.image[0].type" />
        </video>
      </div>
      <div v-else class="ss-img no-hover cursor-pointer" @click="isActiveDetail = true">
        <div class="img-bg" :style="'background-image:url(\''+selfPost.image[0].path+'\');'"></div>
      </div>
    </template>
    <template v-else-if="selfPost.image.length == 2">
      <div class="grids cursor-pointer" style="--gs:0rem;" @click="isActiveDetail = true">
        <div class="grid sm-50">
          <div class="ss-img no-hover" style="border-top-right-radius:0;">
            <div class="img-bg" :style="'background-image:url(\''+selfPost.image[0].path+'\');'"></div>
          </div>
        </div>
        <div class="grid sm-50">
          <div class="ss-img no-hover" style="border-top-left-radius:0;">
            <div class="img-bg" :style="'background-image:url(\''+selfPost.image[1].path+'\');'"></div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="selfPost.image.length >= 3">
      <div class="grids cursor-pointer" style="--gs:0rem;" @click="isActiveDetail = true">
        <div class="grid sm-75">
          <div class="ss-img vertical-sm no-hover" style="border-top-right-radius:0;">
            <div class="img-bg" :style="'background-image:url(\''+selfPost.image[0].path+'\');'"></div>
          </div>
        </div>
        <div class="grid sm-25">
          <div class="ss-img adaptive-half no-hover" style="border-top-left-radius:0;">
            <div class="img-bg" :style="'background-image:url(\''+selfPost.image[1].path+'\');'"></div>
          </div>
          <div class="ss-img adaptive-half no-hover" style="border-radius:0;">
            <div class="img-bg" :style="'background-image:url(\''+selfPost.image[2].path+'\');'"></div>
          </div>
        </div>
      </div>
    </template>
    
    <div class="text-container">
      <div class="title-container">
        <h6 class="title fw-600">
          {{selfPost.title}}
        </h6>
        <div class="option-icon">
          <a class="icon" href="javascript:" @click="isActivePopup = !isActivePopup">
            <img src="/assets/img/icon/dots.png" alt="Image Icon" />
          </a>
          <div class="popup-options bshadow" :class="{ 'active': isActivePopup }">
            <div class="wrapper">
              <!-- <div class="menu-container">
                <a class="menu color-gray h-color-01" href="javascript:">
                  <div class="icon">
                    <img src="/assets/img/icon/bell-02.png" alt="Image Icon" />
                  </div>
                  <div class="text">Turn on notifications for this post</div>
                </a>
                <a class="menu color-gray h-color-01" href="javascript:">
                  <div class="icon">
                    <img src="/assets/img/icon/embed.png" alt="Image Icon" />
                  </div>
                  <div class="text">Embed</div>
                </a>
              </div> -->
              <div class="menu-container">
                <!-- <a class="menu color-gray h-color-01" href="javascript:">
                  <div class="icon">
                    <img src="/assets/img/icon/drag.png" alt="Image Icon" />
                  </div>
                  <div class="text">Hide Post</div>
                </a> -->
                <!-- <a class="menu color-gray h-color-01" href="javascript:">
                  <div class="icon">
                    <img src="/assets/img/icon/clock.png" alt="Image Icon" />
                  </div>
                  <div class="text">Snooze Derrick Sheril for 30 days</div>
                </a> -->
                <a class="menu color-gray h-color-01" href="javascript:">
                  <div class="icon">
                    <img src="/assets/img/icon/unfollow.png" alt="Image Icon" />
                  </div>
                  <div class="text">Follow Mentor</div>
                </a>
                <!-- <a class="menu color-gray h-color-01" href="javascript:">
                  <div class="icon">
                    <img src="/assets/img/icon/report.png" alt="Image Icon" />
                  </div>
                  <div class="text">Find suport or report post</div>
                </a> -->
              </div>
              <div class="menu-container" v-if="selfPost.sharedUser == user.id || selfPost.user.id == user.id">
                <a 
                  class="menu color-gray h-color-01" href="javascript:" 
                  @click="isActivePopup = false; isActivePopupDelete = true;"
                >
                  <div class="icon">
                    <img src="/assets/img/icon/close.png" alt="Image Icon" />
                  </div>
                  <div class="text">Delete</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="stat xs fw-600 color-gray">
        <router-link :to="{ name: 'UserProfilePage', params: { id: selfPost.user.id, username: selfPost.user.firstname + '_' + selfPost.user.lastname } }">
          {{selfPost.user.firstname}} {{selfPost.user.lastname}}
        </router-link>
        <span class="dot"></span>
        {{formatDate(selfPost.createdAt)}}
      </p>

      <template v-if="selfPost.desc.indexOf('https://www.youtube.com/') < 0">
        <!-- <p class="sm fw-300 color-gray lh-xs mt-3">
          {{selfPost.desc}}
        </p> -->

        <div v-for="(c, i) in selfPost.desc" :key="i">
          <p class="sm fw-300 color-gray lh-xs mt-3" v-if="c.type == 'text'">
            {{c.content}}
          </p>

          <p class="sm fw-300 color-gray lh-xs mt-3" v-if="c.type == 'link'">
            <a :href="c.content" >{{c.content}}</a>
          </p>
        </div>

      </template>

      <template v-if="selfPost.desc.indexOf('https://www.youtube.com/') < 0">

        <div v-for="(c, i) in selfPost.desc" :key="i">
          <p class="sm fw-300 color-gray lh-xs mt-3" v-if="c.type == 'link' && c.dataLink != null">
            <PreviewLinkCard 
              :title="c.dataLink.title" 
              :description="c.dataLink.description" 
              :url="c.dataLink.url" 
              :image="c.dataLink.image"
            />
          </p>
        </div>

      </template>
      
      <div class="toolbar mt-3">
        <div class="post-icon color-gray mr-4">
          <img class="mr-2" src="/assets/img/icon/message.png" alt="Image Icon" />
          {{selfPost.counts.comments}}
        </div>
        <a 
          class="post-icon color-gray mr-4" href="javascript:" 
          :class="{ 'active': selfPost.actions.liked  }" 
          @click="togglePostLike()" 
        >
          <img class="mr-2" src="/assets/img/icon/heart.png" alt="Image Icon" />
          {{formatNumber(selfPost.counts.likes, 0)}}
        </a>
        <a 
          class="post-icon mr-4" href="javascript:" 
          :class="{ 'active': selfPost.actions.shared  }" 
          @click="togglePostShare"
        >
          <img src="/assets/img/icon/share.png" alt="Image Icon" />
        </a>
        <!-- <a 
          class="post-icon" href="javascript:" 
          :class="{ 'active': selfPost.actions.followed  }" 
          @click="selfPost.actions.followed = !selfPost.actions.followed"
        >
          <img src="/assets/img/icon/ribbon.png" alt="Image Icon">
        </a> -->
      </div>

      <form @submit.prevent="commentOnPost()">
        <div class="comment mt-4">
          <div class="wrapper ai-center">
            <Avatar :avatar="user.avatar" />
            <FormGroup
              placeholder="Write a comment..." :required="true" 
              icon="send.png" wrapperClass="append fgray" 
              :value="comment" @input="(event) => comment = event" 
            />
          </div>
        </div>
      </form>

      <CommentPost v-if="showComments.length > 0" :comments="showComments" :key="randomId" />

      <div v-if="selfPost.counts.comments > 1" class="mt-3">
        <a 
          v-if="commentLimit <= selfPost.counts.comments - 1"  
          class="p sm fw-400 color-gray h-color-01" href="javascript:" 
          @click="callComment($event)"
        >
          <u>View more comments</u>
        </a>
        <a 
          v-else class="p sm fw-400 color-gray h-color-01" href="javascript:" 
          @click="commentLimit = 1" 
        >
          <u>Hide comments</u>
        </a>
      </div>

    </div>
  </div>

  <!-- Popup Delete -->
  <div class="popup-container" :class="{ 'active': isActivePopupDelete }">
    <div class="wrapper">
      <div class="close-filter" @click="isActivePopupDelete = false"></div>
      <div class="popup-box md bg-white">
        <form class="w-full" @submit.prevent="onClickDelete">
          <h6 class="h5 fw-600 text-center lh-xs">
            Are you sure that you want to delete this post?
          </h6>
          <div class="d-flex ai-center jc-center mt-4 pt-2">
            <Button type="submit" text="DELETE" classer="btn-color-06 mr-3" />
            <a 
              href="javascript:" class="btn btn-action btn-color-05"
              @click="isActivePopupDelete = false" 
            >
              CANCEL
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Popup Detail -->
  <template v-if="user && isActiveDetail">
    <template 
      v-if="selfPost.image.length > 0 && selfPost.image[0].type != 'video/mp4' 
        && selfPost.image[0].path.indexOf('.mp4') < 0" 
    >
      <PostSinglePopupDetail 
        :images="selfPost.image" :isActive="isActiveDetail" 
        @close="isActiveDetail = false"
      />
    </template>
  </template>

</template>

<script>
import moment from 'moment';
import {mapGetters, mapActions, mapMutations} from "vuex";
import { _CommentPost } from '../models/post';
import CommentPost from './CommentPost';
import PostSinglePopupDetail from './PostSinglePopupDetail';
import { postService } from '../services';
import PreviewLinkCard from '../components/PreviewLinkCard'

export default {
  name: 'PostSingle',
  components: {
    CommentPost,
    PostSinglePopupDetail,
  },
  props: {
    post: { type: Object, default: {} }
  },
  data() {
    return {
      randomId: Math.round(Math.random() * 10000000),
      isActiveDetail: false,

      selfPost: this.post,
      listContent: [], // For display on single post
      isActivePopup: false,
      isActivePopupDelete: false,
      commentLimit: 1,
      comment: '',

      _DisplayInputComment: false,
      _ReplyCommentID: 0,
      _DepthComment: 0,
      _PostID: 0
    }
  },
  created() {
    // console.log( this.selfPost )
  },
  mounted: function() {
    // try{
    //   this.$refs.videoPlayer.play();
    // } catch {
      
    // }
  },
  computed: {
    showComments: function() {
      var that = this;
      return that.selfPost.comments.filter(function(d, i){
        return that.selfPost.comments.length - i - 1 < that.commentLimit;
      });
    },
    ...mapGetters({
      user: 'authentication/user',
      getSocketID: 'socketIO/getSocketID',
    })
  },
  methods: {
    ...mapActions({
      fetchComment: 'post/fetchComment',
      delete: 'post/delete',
      sentiment: 'post/sentiment',
      removeSentiment: 'post/rm_sentiment',
      sharePost: 'post/sharePost',
      commentOrReply: 'post/commentOrReply',
    }),

    formatNumber(value, digits=2) {
      let val = (value/1).toFixed(digits);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatDate(value) {
      return moment(String(value)).format('MM/DD/YYYY HH:mm:ss');
    },

    togglePostLike() {
      if(this.selfPost.actions.liked){
        this.selfPost.actions.liked = false;
        this.selfPost.counts.likes -= 1;
        this.removeSentiment({
          sentiment_id: this.selfPost.id,
          sentiment_on: 'Post'
        }).then( () => {
          /*this.selfPost.actions.liked = false;
          this.selfPost.counts.likes -= 1;*/
        }, err => {
          this.selfPost.actions.liked = true;
          this.selfPost.counts.likes += 1;
        });
      }else{
        this.selfPost.actions.liked = true;
        this.selfPost.counts.likes += 1;
        this.sentiment({
          post_id: this.selfPost.id,
          sentiment_type: '1'
        }).then( () => {
          /*this.selfPost.actions.liked = true;
          this.selfPost.counts.likes += 1;*/
          this.getSocketID.emit('sent-realtime-notify',{
              sentiment_type: '1',
              post_id: this.selfPost.id,
              user_id: this.selfPost.user.id,
              user_like_post_id: this.user.id,
              user_like_post_firstname: this.user.firstname,
              user_like_post_lastname: this.user.lastname,
          });

        }, err => {
          this.selfPost.actions.liked = false;
          this.selfPost.counts.likes -= 1;
        });
      }
    },

    togglePostShare() {
      if(this.selfPost.shared){
        this.sharePost(this.selfPost.shared.origin)
      } else {
        this.sharePost(this.selfPost.id)
      }
    },
    commentLikeToggle(c) {
      if(c.actions.liked){
        c.actions.liked = false;
        c.counts.likes -= 1;
        this.removeSentiment({
          sentiment_id: c.id,
          sentiment_on: 'Comment'
        }).then( () => {
          /*c.actions.liked = false;
          c.counts.likes -= 1;*/
        },err => {
          c.actions.liked = true;
          c.counts.likes += 1;
        });
      }else{
        c.actions.liked = true;
        c.counts.likes += 1;
        this.sentiment({
          comment_id: c.id,
          sentiment_type: '1'
        }).then( () => {
          /*c.actions.liked = true;
          c.counts.likes += 1;*/
        },err => {
          c.actions.liked = false;
          c.counts.likes -= 1;
        });
      }
    },

    commentOnPost() {
      // this.selfPost.comments.push({
      //   comment: this.comment,
      //   createdAt: new Date(),
      //   user: this.user,
      //   counts: {
      //     likes: 0
      //   },
      //   actions: {
      //     liked: false
      //   }
      // });
      // this.comment = '';
      // this.commentLimit += 1;
      const commentObject = new _CommentPost(this.selfPost.id, this.comment, this.user, this.selfPost.depth);
      this.selfPost.comments.push( commentObject );
      this.commentOrReply(commentObject).then( res => {
        this.comment = '';
      });
    },

    callComment() {
      // const that = this
      this.commentLimit = this.commentLimit + 3;
      this.fetchComment(this.selfPost.id)
    },
    onClickDelete() {
      this.delete(this.selfPost.id)
    },

    getYoutubeId(desc) {
      var temp = desc.split('?v=');
      return temp[1];
    },

    handleClickLinkPrevuew(preview) {
      console.log('click', preview.domain, preview.title, preview.description, preview.img)
    }
  }
}
</script>
