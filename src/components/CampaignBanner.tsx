import type { Campaign } from '@/lib/api';

import SmartLink from './SmartLink';

export default function CampaignBanner({ campaign }: { campaign: Campaign | undefined }) {
  if (!campaign) return null;
  return (
    <div className="campaign" role="region" aria-label="Campaña">
      <div className="container campaign-inner">
        <strong>{campaign.headline}</strong>
        {campaign.body ? <span className="campaign-body">{campaign.body}</span> : null}
        {campaign.cta_label && campaign.cta_href ? (
          <SmartLink href={campaign.cta_href} className="campaign-cta">
            {campaign.cta_label} →
          </SmartLink>
        ) : null}
      </div>
    </div>
  );
}
