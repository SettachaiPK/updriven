<template>
  <div class="comments">
    <div 
      v-for="(c, i) in updateCommentOrReply" :key="i" class="comment mt-3" 
      :class="{ 'has-children': c.children.length || _DisplayInputComment }"
    >
      <div class="wrapper">
        <Avatar :avatar="c.user.avatar" />
        <div class="text">
          <div class="bg-fgray bradius-1 p-3">
            <p class="sm fw-500 lh-xs">
              {{c.user.firstname}} {{c.user.lastname}}
            </p>
            <p class="sm lh-xs ovf-hidden" v-html="c.comment"></p>
          </div>
          <p class="xs fw-400 color-gray mt-1">
            {{formatDate(c.createdAt)}} 
            <a 
              class="color-gray fw-600 ml-3" :class="{ 'color-01': c.isSentiment }"
              href="javascript:" @click="commentLikeToggle(c)"
            >
              Like
              <span v-if="c.counts.likes">
                {{c.counts.likes}}
              </span>
            </a>
            <a 
              class="color-gray h-color-01 fw-600 ml-3" href="javascript:"
              @click="_DisplayInputComment = !_DisplayInputComment, (_ReplyCommentID === c.id? _ReplyCommentID = 0 : _ReplyCommentID = c.id), _DepthComment = c.depth, _IndexReply = i"
            >
              Reply
            </a>
          </p>
        </div>
      </div>

      <form @submit.prevent="replyComment()" v-if="_ReplyCommentID === c.id" class="comments">
        <div class="comment mt-3">
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
      
      <CommentPost v-if="c.children.length > 0" :comments="c.children" :key="randomId" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {mapGetters, mapActions, mapMutations} from "vuex";
import { _CommentPost } from '../models/post';

export default {
  name: 'CommentPost',
  props: {
    comments: { type: Object, default: [] },
  },
  data() {
    return {
      randomId: Math.round(Math.random() * 10000000),
      _Comments: this.comments,
      _DisplayInputComment: false,
      _ReplyCommentID: 0,
      _Comment: '',
      _DepthComment: 0,
      _PostID: this.comments[0].postID,
      _IndexReply: 0,
    }
  },
  computed: {
    ...mapGetters({
      user: 'authentication/user',
    }),

    updateCommentOrReply: function() {
      this._Comments = this.comments;
      return this._Comments
    }
  },
  updated() {
    console.log('_ReplyCommentID :', this._ReplyCommentID)
  },
  methods: {
    ...mapActions({
      commentOrReply: 'post/commentOrReply',
      sentiment: 'post/sentiment',
      removeSentiment: 'post/rm_sentiment',
    }),

    commentLikeToggle(c) {
      if(c.isSentiment){
        c.isSentiment = false;
        c.counts.likes -= 1;
        this.removeSentiment({
          sentiment_id: c.id,
          sentiment_on: 'Comment'
        })
        .then( () => {
          /*c.actions.liked = false;
          c.counts.likes -= 1;*/
        }, err => {
          c.isSentiment = true;
          c.counts.likes += 1;
        });
      }else{
        c.isSentiment = true;
        c.counts.likes += 1;
        this.sentiment({
          comment_id: c.id,
          sentiment_type: '1'
        }).then( () => {
          /*c.actions.liked = true;
          c.counts.likes += 1;*/
        }, err => {
          c.isSentiment = false;
          c.counts.likes -= 1;
        });
      }
    },

    replyComment() {
      const commentObject = new _CommentPost(this._PostID, this.comment, this.user, this._DepthComment + 1, this._ReplyCommentID);
      console.log(commentObject)
      this._Comments[this._IndexReply].children.push( commentObject )
      this.commentOrReply(commentObject).then( 
        this.comment = ''
      )
    },

    formatDate(value) {
      return moment(String(value)).format('MM/DD/YYYY');
    },
  },
}
</script>