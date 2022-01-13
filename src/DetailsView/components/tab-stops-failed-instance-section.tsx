// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ResultSectionTitle } from 'common/components/cards/result-section-title';
import { NamedFC } from 'common/react/named-fc';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import * as styles from 'DetailsView/components/tab-stops-failed-instance-section.scss';
import { requirements } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsInstanceSectionPropsFactory } from 'DetailsView/components/tab-stops/tab-stops-instance-section-props-factory';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import {
    TabStopsRequirementsWithInstances,
    TabStopsRequirementsWithInstancesDeps,
} from 'DetailsView/tab-stops-requirements-with-instances';
import * as React from 'react';

export type TabStopsFailedInstanceSectionDeps = TabStopsRequirementsWithInstancesDeps & {
    tabStopsFailedCounter: TabStopsFailedCounter;
    tabStopsInstanceSectionPropsFactory: TabStopsInstanceSectionPropsFactory;
};

export interface TabStopsFailedInstanceSectionProps {
    deps: TabStopsFailedInstanceSectionDeps;
    tabStopRequirementState: TabStopRequirementState;
    alwaysRenderSection: boolean;
}

export const tabStopsFailedInstanceSectionAutomationId = 'tab-stops-failure-instance-section';

export const TabStopsFailedInstanceSection = NamedFC<TabStopsFailedInstanceSectionProps>(
    'TabStopsFailedInstanceSection',
    props => {
        const results = [];

        for (const [requirementId, data] of Object.entries(props.tabStopRequirementState)) {
            if (data.status !== 'fail') {
                continue;
            }

            results.push({
                id: requirementId,
                name: requirements[requirementId].name,
                description: requirements[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            });
        }

        const totalFailedInstancesCount: number =
            props.deps.tabStopsFailedCounter.getTotalFailed(results);

        if (!props.alwaysRenderSection && totalFailedInstancesCount === 0) {
            return null;
        }

        const instanceSectionProps = props.deps.tabStopsInstanceSectionPropsFactory({
            headingLevel: 3,
            results,
            tabStopRequirementState: props.tabStopRequirementState,
            deps: props.deps,
        });

        return (
            <div
                className={styles.tabStopsFailureInstanceSection}
                data-automation-id={tabStopsFailedInstanceSectionAutomationId}
            >
                <h2>
                    <ResultSectionTitle
                        title="Failed instances"
                        badgeCount={totalFailedInstancesCount}
                        outcomeType="fail"
                        titleSize="title"
                    />
                </h2>
                <TabStopsRequirementsWithInstances {...instanceSectionProps} />
            </div>
        );
    },
);