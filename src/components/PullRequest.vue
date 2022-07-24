<template>
  <div class="pr-wrapper">
    <div class="pr-title">
      <span v-if="isApprovedByUser" title="you have approved this PR">✓</span>
      <span v-else-if="isViewedByUser" title="you have reviewed this PR without approve">👁</span>
      {{pr.getTitle()}} ({{pr.getAuthor().getUsername()}})
    </div>
    <div class="pr-info">
      <div class="pr-reviews" title="total approves">{{totalApproves}} ✓</div>
      <div class="pr-comments" title="PR author comments/reviewers comments">{{authorCommentsCount}}/{{reviewersCommentsCount}} 💬</div>
      <div class="pr-update" title="last update">{{pr.getLastUpdate()}}</div>
    </div>
  </div>
</template>

<script>
import {GitOrganization, GitPullRequest} from "@/models/Git.model";

export default {
  name: 'MenuItem',
  props: {
    org: GitOrganization,
    pr: GitPullRequest
  },
  computed: {
    isApprovedByUser: function () {
      return this.pr.isApprovedByUser(this.org.user.getUsername())
    },
    isViewedByUser: function () {
      return this.pr.isViewedByUser(this.pr.getAuthor().getUsername(), this.org.user.getUsername())
    },
    totalApproves: function () {
      return this.pr.getApprovesCount()
    },
    authorCommentsCount: function() {
      return this.pr.getAuthorCommentsCount(this.pr.getAuthor().getUsername())
    },
    reviewersCommentsCount: function() {
      return this.pr.getReviewersCommentsCount(this.pr.getAuthor().getUsername())
    }
  }
}
</script>
<style scoped>
.pr-wrapper {
}

.pr-title{
  word-break: break-all;
}

.pr-info {
  display: grid;
  grid-template-columns: 35px 60px auto;

  line-height: 30px;
}

.pr-reviews{
  text-align: center;
}

.pr-comments {
  text-align: center;
}

.pr-update {
  white-space: nowrap;
}
</style>
