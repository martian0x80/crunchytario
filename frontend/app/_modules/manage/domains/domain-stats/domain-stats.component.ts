import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DomainSelectorService } from '../../_services/domain-selector.service';
import { DomainBadgeComponent } from '../../badges/domain-badge/domain-badge.component';
import { StatsComponent } from '../../stats/stats/stats.component';

@Component({
    selector: 'app-domain-stats',
    templateUrl: './domain-stats.component.html',
    imports: [
        DomainBadgeComponent,
        AsyncPipe,
        StatsComponent,
    ],
})
export class DomainStatsComponent {
    readonly domainMeta$ = inject(DomainSelectorService).domainMeta(true);
}
