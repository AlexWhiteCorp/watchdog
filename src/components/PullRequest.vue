<template>
  <div class="pr-wrapper">
    <div class="pr-title">
      <span v-if="isApprovedByUser" title="you have approved this PR">✓ </span>
      <span v-else-if="isViewedByUser" title="you have reviewed this PR without approve">👁 </span>
      <span style="word-break: break-all">{{pr.getTitle()}}</span> <span style="white-space: nowrap">({{pr.getAuthor().getUsername()}})</span>
    </div>
    <div class="pr-info">
      <div class="pr-reviews" title="total approves">{{totalApproves}} ✓</div>
      <div class="pr-comments" title="resolved discussions/total discussions">{{notActiveDiscussionsCount}}/{{totalDiscussionsCount}} 💬</div>
      <div class="pr-update" title="last update">{{lastUpdate}}</div>
    </div>
  </div>
</template>

<script>
import {GitOrganization, GitPullRequest} from "@/models/Git.model";
import {dateFormatted} from "@/utils/utils";

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
      return this.pr.isViewedByUser(this.org.user.getUsername())
    },
    totalApproves: function () {
      return this.pr.getApprovesCount()
    },
    notActiveDiscussionsCount: function() {
      return this.pr.getTotalDiscussionsCount() - this.pr.getActiveDiscussionsCount()
    },
    totalDiscussionsCount: function() {
      return this.pr.getTotalDiscussionsCount()
    },
    lastUpdate: function () {
      return dateFormatted(this.pr.getLastUpdate())
    }
  }
}
</script>
<style scoped>
.pr-wrapper {
}

.pr-title{
  display: inline;
}

.pr-info {
  display: grid;
  grid-template-columns: 35px 60px auto;

  line-height: 24px;
}

.pr-reviews {
  text-align: center;
  color: var(--fg-secondary);
  font-size: 12px;
}

.pr-comments {
  text-align: center;
  color: var(--fg-secondary);
  font-size: 12px;
}

.pr-update {
  white-space: nowrap;
  color: var(--fg-secondary);
  font-size: 12px;
}
</style>
