Ce document présente des examples de code afin de vous aider à jouer avec les templates Hapify.

## Pré-requis

Avant de lire cet article, nous vous recommandons de lire la documentation sur les [templates Hapify](../reference/hapify-syntax).

## Création d'une classe TypeScript

=== "Hapify (long)"

    ```hapify
    <<# Import dependencies >>
    <<for Dependencies not (hidden and internal) dep>>
    import {<<dep pascal>>} from './<<dep pascal>>';
    <<endfor>>
     
    <<# Declare interfaces for enum fields >>
    <<for Fields enum field>>
    export type <<Model pascal>><<field pascal>>Enum =<<for field.enum e>> | '<<e snake>>'<<endfor>>;
    <<endfor>>
     
    export class <<Model pascal>> {
     
        <<for Fields not primary field>>
            <<if field entity>>
        private <<field camel>>: number<<if field multiple>>[]<<endif>>;
            <<elseif field enum>>
        public <<field camel>>: <<Model pascal>><<field pascal>>Enum;
            <<elseif field datetime>>
        public <<field camel>>: Date;
            <<else>>
        public <<field camel>>: <<=field.type>>;
            <<endif>>
        <<endfor>>
     
        constructor(private <<PrimaryField camel>>: number) {}
     
        <<# Getter for primary field >>
        getId(): number {
            return this.<<PrimaryField camel>>
        }
        
        getLabel(): string {
            <<if Fields label>>
            return `<<=labels()>>`;
            <<else>>
            return this.getId().toString();
            <<endif>>
        }
        
        <<# Getter for each entity >>
        <<for Fields entity field>>
     
        get<<field pascal>>(): <<field.model pascal>><<if field multiple>>[]<<endif>> {
            <<if field multiple>>
            return this.<<field camel>>.map(id => new <<field.model pascal>>(id));
            <<else>>
            return new <<field.model pascal>>(this.<<field camel>>);
            <<endif>>
        }
        <<endfor>>
    
    }
    
    <<<
    function labels() {
        return root.fields.label
            .map(label => "${this."+label.names.snake+"}")
            .join(' ');
    }
    >>>
    ```

=== "Sortie 1"

    ```typescript
    import {PlaceCategory} from './PlaceCategory';
    import {Service} from './Service';
    import {User} from './User';
    
     
    export class Place {
    
        public name: string;
        public description: string;
        private categories: number[];
        public address1: string;
        public address2: string;
        public latitude: number;
        public longitude: number;
        public phone: string;
        public websiteUrl: string;
        private services: number[];
        public timetable: string;
        private owner: number;
        public disabled: boolean;
    
        constructor(private id: number) {}
    
        getId(): number {
            return this.id
        }
    
        getLabel(): string {
            return `${this.name}`;
        }
    
        getCategories(): PlaceCategory[] {
            return this.categories.map(id => new PlaceCategory(id));
        }
    
        getServices(): Service[] {
            return this.services.map(id => new Service(id));
        }
    
        getOwner(): User {
            return new User(this.owner);
        }
    }
    ```

=== "Sortie 2"

    ```typescript
    export type UserRoleEnum = | 'admin' | 'user';
    
    export class User {
    
        public name: string;
        public email: string;
        public password: string;
        public role: UserRoleEnum;
        public banned: boolean;
        public lastConnectedAt: Date;
    
        constructor(private id: number) {}
    
        getId(): number {
            return this.id
        }
    
        getLabel(): string {
            return `${this.name}`;
        }
    
    }
    ```
