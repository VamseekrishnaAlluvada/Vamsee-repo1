import { useEffect } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { MissionControl } from '@/pages/MissionControl';
import { Execution } from '@/pages/Execution';
import { ApiRunner } from '@/pages/ApiRunner';
import { Results } from '@/pages/Results';
import { SdetPlaybook } from '@/pages/SdetPlaybook';
import { useStore } from '@/store/useStore';
import { connectSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import type { EnvName } from '@/types';

const ENVS: EnvName[] = ['dev', 'staging', 'prod'];

export default function App() {
  const activePage = useStore((s) => s.activePage);

  useEffect(() => {
    // Live channel for pushed updates.
    connectSocket();

    // Initial REST hydrate (in case the socket snapshot is delayed / server just started).
    (async () => {
      try {
        for (const env of ENVS) {
          const [run, history] = await Promise.all([api.latest(env), api.history(env)]);
          useStore.getState().ingestResults(env, run, history);
        }
        const [topology, healer, customApis, runs] = await Promise.all([
          api.topology(),
          api.healer(),
          api.listCustomApis(),
          api.pipelineRuns(),
        ]);
        useStore.getState().setTopology(topology);
        useStore.getState().setHealer(healer);
        useStore.getState().setCustomApis(customApis);
        useStore.getState().setPipelineRuns(runs);
      } catch {
        // Server may not be up yet; the socket will hydrate on connect.
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      {activePage === 'mission' && <MissionControl />}
      {activePage === 'execution' && <Execution />}
      {activePage === 'runner' && <ApiRunner />}
      {activePage === 'results' && <Results />}
      {activePage === 'playbook' && <SdetPlaybook />}
    </DashboardLayout>
  );
}
