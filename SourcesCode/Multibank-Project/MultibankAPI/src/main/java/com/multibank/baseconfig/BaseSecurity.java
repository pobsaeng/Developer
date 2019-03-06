package com.multibank.baseconfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class BaseSecurity extends WebSecurityConfigurerAdapter {

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenEntryPoint unauthorizedHandler;

    @Bean
    public JwtAuthenFilter jwtAuthenticationFilter() {
        return new JwtAuthenFilter();
    }
    
//    @Bean
//    public RoleHierarchy roleHierarchy() {
//        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
//        /* tricks lies here */
//        roleHierarchy.setHierarchy("ROLE_SUPREME > ROLE_ADMIN ROLE_ADMIN > ROLE_OPERATOR ROLE_OPERATOR > ROLE_GUEST");
//        return roleHierarchy;
//    }

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser("70003017").password("0123456").roles("ADMIN");
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors()
                .and()
                .csrf()
                .disable()                
                .exceptionHandling()
                .authenticationEntryPoint(unauthorizedHandler)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) 
                .and()
                .authorizeRequests()
//                    .antMatchers("/",
//                        "/favicon.ico",
//                        "/**/*.png",
//                        "/**/*.gif",
//                        "/**/*.svg",
//                        "/**/*.jpg",
//                        "/**/*.html",
//                        "/**/*.css",
//                        "/**/*.js")
//                    .permitAll()
                    .antMatchers("/api/auth/**")
                    .permitAll()
                    .antMatchers("/api/user/**")
                    .permitAll()
                    .antMatchers("/api/treemenu/**")
                    .permitAll()
                    .antMatchers("/api/customer/**")
                    .permitAll()
                    .antMatchers("/api/contact/**")
                    .permitAll()
                    .antMatchers("/api/bankcheque/**")
                    .permitAll()
                    .antMatchers(HttpMethod.GET, 
                    		"/api/holiday/**", 
                    		"/api/holiday/delete/**",
                    		"/api/customer/findid/**",
                    		"/api/contact/delete/**")
                    .permitAll()
                    .antMatchers(HttpMethod.POST, 
                    		"/api/holiday/add/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated();

        // Add our custom JWT security filter
//        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    }

}