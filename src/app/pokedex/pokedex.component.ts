import { Component, OnInit } from '@angular/core';
import { IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { concat, forkJoin, from, merge, of } from 'rxjs';
import { combineAll, concatAll, first, map, mergeAll, mergeMap, pluck, reduce, scan, switchAll, switchMap, tap, zip } from 'rxjs/operators';

import { PokeApiService } from '../pokeapi/pokeapi.service';

interface CombinedData {
  species: IPokemonSpecies;
  pokemon: IPokemon;
  types: IType[];
};

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.sass']
})
export class PokedexComponent implements OnInit {

  pokemon: IPokemon[] = [];
  species: IPokemonSpecies[] = [];
  // types: IType[] = [];
  data: CombinedData[] = [];

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit(): void {
    this.getCombinedData();
  }

  getCombinedData() {
    this.pokeApiService.listPokemonSpecies(4)
      .pipe(
        mergeMap(listPokemonSpeciesResponse => {
          return listPokemonSpeciesResponse.results.map(result => {
            const { name } = result;
            const species$ = this.pokeApiService.getPokemonSpecies(name);
            const pokemon$ = this.pokeApiService.getPokemon(name);
            return forkJoin([species$, pokemon$]).pipe(
              mergeMap(([species, pokemon]) => {
                this.pokemon.push(pokemon);
                this.species.push(species);
                const types$ = pokemon.types.map(type => {
                  const { name } = type.type;
                  return this.pokeApiService.getType(name)
                })
                return forkJoin(types$).pipe(
                  map(types => {
                    // this.types = this.types.concat(types); // Ends up with multiple of the same
                    return {
                      species,
                      pokemon,
                      types
                    }
                  }),
                );
              }),
            );
          });
        }),
        concatAll(), // TODO: Is there a way to not require this? Is order preserved?
        reduce((acc, cur) => {
          acc.push(cur);
          return acc
        }, [] as CombinedData[]),
      )
      .subscribe(data => {
        this.data = data;
      });
  }

}
