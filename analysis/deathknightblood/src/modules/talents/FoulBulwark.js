import { formatDuration, formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

import BoneShieldTimesByStacks from '../features/BoneShieldTimesByStacks';

const HP_PER_BONE_SHIELD_STACK = 0.01;

class FoulBulwark extends Analyzer {
  static dependencies = {
    boneShieldTimesByStacks: BoneShieldTimesByStacks,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.FOUL_BULWARK_TALENT.id);
  }

  get boneShieldTimesByStack() {
    return this.boneShieldTimesByStacks.boneShieldTimesByStacks;
  }

  get averageFoulBullwark() {
    return formatPercentage(
      this.boneShieldTimesByStacks.averageBoneShieldStacks * HP_PER_BONE_SHIELD_STACK,
    );
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(3)}
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        dropdown={
          <table className="table table-condensed">
            <thead>
              <tr>
                <th>HP-bonus</th>
                <th>Time (s)</th>
                <th>Time (%)</th>
              </tr>
            </thead>
            <tbody>
              {this.boneShieldTimesByStack.map((e, i) => (
                <tr key={i}>
                  <th>{(i * HP_PER_BONE_SHIELD_STACK * 100).toFixed(0)}%</th>
                  <td>{formatDuration(e.reduce((a, b) => a + b, 0))}</td>
                  <td>
                    {formatPercentage(e.reduce((a, b) => a + b, 0) / this.owner.fightDuration)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <BoringSpellValueText spellId={SPELLS.FOUL_BULWARK_TALENT.id}>
          {this.averageFoulBullwark}% <small>average buff</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default FoulBulwark;
