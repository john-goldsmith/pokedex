import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAbility, IPokemon, IPokemonSpecies } from 'pokeapi-typescript';
import { PokeApiService } from '../pokeapi/pokeapi.service';

interface GenderPercentages {
  male: number;
  female: number;
  genderless: number;
}

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.sass']
})
export class PokemonDetailComponent implements OnInit {

  pokemon!: IPokemon;
  pokemonSpecies!: IPokemonSpecies;
  rawAbilities: IAbility[] = [];
  abilities: string = '';
  eggGroups: string = '';
  // mergedPokemon!: IPokemon & IPokemonSpecies;

  constructor(
    private pokeApiService: PokeApiService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) private localeId: string
  ) { }

  ngOnInit(): void {
    const { idOrName } = this.route.snapshot.params;
    this.getPokemon(idOrName);
    this.getPokemonSpecies(idOrName);
  }

  getPokemon(param: string | number): void {
    this.pokeApiService.getPokemon(param).subscribe(pokemon => {
      this.pokemon = pokemon;
      this.getAbilities();
    });
  }

  getPokemonSpecies(param: string | number): void {
    this.pokeApiService.getPokemonSpecies(param).subscribe(pokemonSpecies => {
      this.pokemonSpecies = pokemonSpecies;
      this.getEggGroups();
    });
  }

  get threeDigitId(): string {
    return `000${this.pokemon.id}`.slice(-3);
  }

  get species(): string {
    return this.pokemonSpecies.genera.find(genus => genus.language.name === this.localeId)?.genus || 'Unknown';
  }

  getAbilities(): void {
    this.pokeApiService.getAbilities(this.pokemon.abilities)
      .subscribe(responses => {
        const names = responses.flatMap(response => response.names);
        const filteredNames = names.filter(name => name.language.name === this.localeId)
        this.abilities = filteredNames.map(name => name.name).join(', ')
      });
  }

  getEggGroups(): void {
    this.pokeApiService.getEggGroups(this.pokemonSpecies.egg_groups)
      .subscribe(responses => {
        const names = responses.flatMap(response => response.names);
        const filteredNames = names.filter(name => name.language.name === this.localeId)
        this.eggGroups = filteredNames.map(name => name.name).join(', ')
      })
  }

  get genderPercentages(): GenderPercentages {
    return {
      male: ((8 - this.pokemonSpecies.gender_rate) / 8) * 100,
      female: (this.pokemonSpecies.gender_rate / 8) * 100,
      genderless: this.pokemonSpecies.gender_rate === -1 ? 100 : 0
    }
  }

  get flavorText(): string {
    return this.pokemonSpecies.flavor_text_entries.find(entry => entry.language.name === this.localeId)?.flavor_text || '';
  }

}
