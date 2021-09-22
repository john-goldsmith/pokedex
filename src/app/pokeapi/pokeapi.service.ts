import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import PokeAPI, {
  IApiResource,
  INamedApiResourceList,
  IPokemon,
  IPokemonSpecies,
  IPokemonAbility,
  IAbility,
  IEggGroup,
  INamedApiResource,
  IType
} from 'pokeapi-typescript';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  listAllPokemon(): Observable<INamedApiResourceList<IPokemon>> {
    const promise = PokeAPI.Pokemon.listAll();
    return from(promise);
  }

  listAllPokemonSpecies(): Observable<INamedApiResourceList<IPokemonSpecies>> {
    const promise = PokeAPI.PokemonSpecies.listAll();
    return from(promise);
  }

  listPokemon(limit = 10, offset = 0): Observable<INamedApiResourceList<IPokemon>> {
    const promise = PokeAPI.Pokemon.list(limit, offset);
    return from(promise);
  }

  listPokemonSpecies(limit = 10, offset = 0): Observable<INamedApiResourceList<IPokemonSpecies>> {
    const promise = PokeAPI.PokemonSpecies.list(limit, offset);
    return from(promise);
  }

  getPokemon(param: string | number): Observable<IPokemon> {
    const promise = PokeAPI.Pokemon.resolve(param);
    return from(promise);
  }

  getPokemonSpecies(param: string | number): Observable<IPokemonSpecies> {
    const promise = PokeAPI.PokemonSpecies.resolve(param);
    return from(promise);
  }

  getAbilities(abilities: IPokemonAbility[]): Observable<IAbility[]> {
    const promises = abilities.map(ability => PokeAPI.Ability.resolve(ability.ability.name));
    return forkJoin(promises);
  }

  getEggGroups(eggGroups: INamedApiResource<IEggGroup>[]): Observable<IEggGroup[]> {
    const promises = eggGroups.map(eggGroup => PokeAPI.EggGroup.resolve(eggGroup.name));
    return forkJoin(promises);
  }

  getType(param: string | number): Observable<IType> {
    const promise = PokeAPI.Type.resolve(param);
    return from(promise);
  }

  fromResource<T>(apiResource: INamedApiResource<T>): Observable<T> {
    const promise = PokeAPI.fromResource(apiResource);
    return from(promise);
  }
}
