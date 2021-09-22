import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.sass']
})
export class PokemonCardComponent {

  @Input() pokemon!: IPokemon;
  @Input() species!: IPokemonSpecies;
  @Input() types!: IType[];

  constructor(
    @Inject(LOCALE_ID) private localeId: string
  ) {}

  get threeDigitId(): string {
    return `000${this.pokemon.id}`.slice(-3);
  }

  get typeClasses(): string {
    return this.pokemon.types.map(type => type.type.name).join(' ');
  }

  get name(): string {
    return this.species.names.find(name => name.language.name === this.localeId)?.name || '';
  }

  get typeNames(): string[] {
    return this.types.map(type => {
      const english = type.names.find(name => name.language.name === this.localeId);
      return english?.name || '';
    });
  }

}
